// Copyright © Todd Agriscience, Inc. All rights reserved.

import { and, asc, eq, exists, isNull, sql } from 'drizzle-orm';
import { db } from '../schema/connection';
import {
  analysis,
  farm,
  formSubmission,
  managementZone,
  user,
} from '../schema';
import {
  MANAGEMENT_ZONE_REQUEST_SLUG,
  ManagementZoneRequestError,
  parseManagementZoneRequestInput,
  readManagementZoneRequestAnswers,
  type ManagementZoneRequestAnswers,
  type ManagementZoneRequestInput,
} from '../utils/management-zone-request';

/** A request whose zone and requester still belong to the recorded farm. */
export interface ManagementZoneRequestRow {
  /** Generic form submission id. */
  id: number;
  /** Owning farm id. */
  farmId: number;
  /** Farm's display name. */
  farmName: string;
  /** Requester's email for sample-kit coordination. */
  requesterEmail: string;
  /** Time the request was received. */
  createdAt: Date;
  /** Validated request details and staff progress. */
  answers: ManagementZoneRequestAnswers;
  /** Analysis existence remains the source of truth for active zones. */
  hasAnalysis: boolean;
}

/** Atomically records a pending zone and its request using a trusted actor. */
export async function createManagementZoneRequest(
  actor: { id: number; farmId: number },
  input: ManagementZoneRequestInput
): Promise<{ id: number; zoneId: number }> {
  const details = parseManagementZoneRequestInput(input);
  return db.transaction(async (tx) => {
    const [zone] = await tx
      .insert(managementZone)
      .values({ farmId: actor.farmId, name: details.name })
      .returning({ id: managementZone.id });
    if (!zone) throw new Error('Unable to create the management zone.');
    const [request] = await tx
      .insert(formSubmission)
      .values({
        formSlug: MANAGEMENT_ZONE_REQUEST_SLUG,
        workflowType: 'generic',
        status: null,
        farmId: actor.farmId,
        retentionConsent: false,
        answers: {
          ...details,
          zoneId: zone.id,
          requestedByUserId: actor.id,
          stage: 'requested',
        },
      })
      .returning({ id: formSubmission.id });
    if (!request)
      throw new Error('Unable to record the management zone request.');
    return { id: request.id, zoneId: zone.id };
  });
}

/** Lists valid zone requests; callers must authorize the staff or farm boundary. */
export async function getManagementZoneRequests(
  farmId?: number
): Promise<ManagementZoneRequestRow[]> {
  const rows = await db
    .select({
      id: formSubmission.id,
      farmId: farm.id,
      farmName: sql<string>`coalesce(${farm.informalName}, ${farm.businessName}, 'Unnamed farm')`,
      requesterEmail: user.email,
      createdAt: formSubmission.createdAt,
      answers: formSubmission.answers,
      hasAnalysis: sql<boolean>`${exists(
        db
          .select({ id: analysis.id })
          .from(analysis)
          .where(eq(analysis.managementZone, managementZone.id))
      )}`,
    })
    .from(formSubmission)
    .innerJoin(farm, eq(farm.id, formSubmission.farmId))
    .innerJoin(
      managementZone,
      and(
        eq(managementZone.farmId, farm.id),
        sql`${managementZone.id}::text = ${formSubmission.answers}->>'zoneId'`
      )
    )
    .innerJoin(
      user,
      and(
        eq(user.farmId, farm.id),
        sql`${user.id}::text = ${formSubmission.answers}->>'requestedByUserId'`
      )
    )
    .where(
      and(
        eq(formSubmission.formSlug, MANAGEMENT_ZONE_REQUEST_SLUG),
        eq(formSubmission.workflowType, 'generic'),
        isNull(formSubmission.deletedAt),
        farmId === undefined ? undefined : eq(farm.id, farmId)
      )
    )
    .orderBy(asc(formSubmission.createdAt));
  return rows.flatMap((row) => {
    const answers = readManagementZoneRequestAnswers(row.answers);
    return answers ? [{ ...row, answers }] : [];
  });
}

/** Records staff progress without changing a zone or creating an analysis. */
export async function advanceManagementZoneRequest(
  id: number,
  step: 'sample_kit_sent' | 'processed',
  reviewerId: number
): Promise<void> {
  if (!Number.isInteger(id) || id <= 0)
    throw new ManagementZoneRequestError('Invalid request id.');
  if (step !== 'sample_kit_sent' && step !== 'processed') {
    throw new ManagementZoneRequestError('Invalid request step.');
  }
  await db.transaction(async (tx) => {
    const [request] = await tx
      .select()
      .from(formSubmission)
      .where(
        and(
          eq(formSubmission.id, id),
          eq(formSubmission.formSlug, MANAGEMENT_ZONE_REQUEST_SLUG),
          eq(formSubmission.workflowType, 'generic'),
          isNull(formSubmission.deletedAt)
        )
      )
      .limit(1)
      .for('update');
    const answers =
      request && readManagementZoneRequestAnswers(request.answers);
    if (!request?.farmId || !answers)
      throw new ManagementZoneRequestError('Request not found.');
    const [zone] = await tx
      .select({ id: managementZone.id })
      .from(managementZone)
      .where(
        and(
          eq(managementZone.id, answers.zoneId),
          eq(managementZone.farmId, request.farmId)
        )
      )
      .limit(1);
    if (!zone)
      throw new ManagementZoneRequestError(
        'The requested zone no longer belongs to this farm.'
      );
    const now = new Date();
    if (step === 'sample_kit_sent') {
      if (answers.stage !== 'requested')
        throw new ManagementZoneRequestError(
          'This sample kit has already been recorded.'
        );
      answers.sampleKitSentAt = now.toISOString();
    } else {
      if (answers.stage !== 'sample_kit_sent')
        throw new ManagementZoneRequestError(
          'Record the sample kit shipment before processing.'
        );
      const [result] = await tx
        .select({ id: analysis.id })
        .from(analysis)
        .where(eq(analysis.managementZone, zone.id))
        .limit(1);
      if (!result)
        throw new ManagementZoneRequestError(
          'Add the soil analysis before marking this request processed.'
        );
      answers.processedAt = now.toISOString();
    }
    answers.stage = step;
    await tx
      .update(formSubmission)
      .set({
        answers: { ...answers },
        reviewedByInternalAccountId: reviewerId,
        reviewedAt: now,
      })
      .where(eq(formSubmission.id, id));
  });
}
