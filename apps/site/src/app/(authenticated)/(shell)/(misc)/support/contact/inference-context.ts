// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { db } from '@nightcrawler/db/schema/connection';
import { formSubmission, managementZone } from '@nightcrawler/db/schema';
import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import {
  INFERENCE_CONTACT_LIFETIME_MS,
  inferenceContactSchema,
  inferenceContextTokenSchema,
} from './inference-schema';
import type { InferenceContactContext } from './types';

/**
 * Loads only an unexpired draft belonging to the session user and farm.
 * Zone ownership is checked again in case it changed after the handoff.
 */
export async function loadInferenceContactContext(
  token: string
): Promise<InferenceContactContext | null> {
  if (!inferenceContextTokenSchema.safeParse(token).success) return null;
  const currentUser = await getAuthenticatedInfo();
  const [draft] = await db
    .select({ id: formSubmission.id, answers: formSubmission.answers })
    .from(formSubmission)
    .where(
      and(
        eq(formSubmission.formSlug, 'iris-contact-draft'),
        eq(formSubmission.workflowType, 'generic'),
        eq(formSubmission.farmId, currentUser.farmId),
        sql`${formSubmission.answers}->>'userId' = ${String(currentUser.id)}`,
        sql`${formSubmission.answers}->>'contextToken' = ${token}`,
        gt(
          formSubmission.createdAt,
          sql`now() - ${INFERENCE_CONTACT_LIFETIME_MS} * interval '1 millisecond'`
        ),
        isNull(formSubmission.deletedAt)
      )
    )
    .limit(1);
  if (!draft) return null;
  const parsed = inferenceContactSchema.safeParse({
    questions: draft.answers.questions,
    managementZoneId: draft.answers.managementZoneId ?? undefined,
  });
  if (!parsed.success) return null;
  let zone: InferenceContactContext['managementZone'] = null;
  if (parsed.data.managementZoneId !== undefined) {
    const [ownedZone] = await db
      .select({ id: managementZone.id, name: managementZone.name })
      .from(managementZone)
      .where(
        and(
          eq(managementZone.id, parsed.data.managementZoneId),
          eq(managementZone.farmId, currentUser.farmId)
        )
      )
      .limit(1);
    if (!ownedZone) return null;
    zone = { id: ownedZone.id, name: ownedZone.name || 'Unnamed zone' };
  }
  return {
    id: draft.id,
    token,
    questions: parsed.data.questions,
    managementZone: zone,
  };
}
