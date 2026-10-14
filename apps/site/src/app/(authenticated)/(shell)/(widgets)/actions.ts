// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db/schema/connection';
import { managementZone } from '@nightcrawler/db/schema/management-zone';
import { managementZoneObservation } from '@nightcrawler/db/schema/management-zone-observation';
import { logger } from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  OBSERVATION_BODY_MAX_LENGTH,
  type CreateObservationInput,
  type UpdateObservationInput,
} from './components/observations/types';

/**
 * Trims an observation note and rejects an empty or oversized value.
 *
 * @param body - Raw note text.
 * @returns The trimmed note.
 */
function normalizeBody(body: string): string {
  const trimmed = body.trim();

  if (!trimmed) {
    throwActionError('Observation is required');
  }

  if (trimmed.length > OBSERVATION_BODY_MAX_LENGTH) {
    throwActionError(
      `Observation must be ${OBSERVATION_BODY_MAX_LENGTH} characters or fewer`
    );
  }

  return trimmed;
}

/**
 * Stores a calendar day at UTC midnight. Values that are already UTC midnight
 * stay on the same day.
 *
 * @param value - The day submitted with the observation.
 * @returns That day at UTC midnight.
 */
function normalizeObservedOn(value: Date): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throwActionError('Date is required');
  }

  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
  );
}

/**
 * Rejects ids that are not positive integers.
 *
 * @param id - Id to check.
 * @param label - Field name used in the error.
 */
function assertPositiveId(id: number, label: string): void {
  if (!Number.isInteger(id) || id <= 0) {
    throwActionError(`Invalid ${label}`);
  }
}

/**
 * Confirms an observation belongs to a zone on the current user's farm.
 *
 * @param id - Observation id.
 * @param farmId - Current user's farm id.
 */
async function assertObservationOnFarm(
  id: number,
  farmId: number
): Promise<void> {
  const [row] = await db
    .select({ id: managementZoneObservation.id })
    .from(managementZoneObservation)
    .innerJoin(
      managementZone,
      eq(managementZoneObservation.managementZoneId, managementZone.id)
    )
    .where(
      and(
        eq(managementZoneObservation.id, id),
        eq(managementZone.farmId, farmId)
      )
    )
    .limit(1);

  if (!row) {
    throwActionError('Observation not found');
  }
}

/**
 * Creates an observation on a management zone that belongs to the current farm.
 *
 * @param input - Zone, note, and observed day.
 * @returns The created observation id.
 */
export async function createObservation(
  input: CreateObservationInput
): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();
    assertPositiveId(input.zoneId, 'zone id');
    const body = normalizeBody(input.body);
    const observedOn = normalizeObservedOn(input.observedOn);

    const [zone] = await db
      .select({ id: managementZone.id })
      .from(managementZone)
      .where(
        and(
          eq(managementZone.id, input.zoneId),
          eq(managementZone.farmId, currentUser.farmId)
        )
      )
      .limit(1);

    if (!zone) {
      throwActionError('Zone not found');
    }

    const [created] = await db
      .insert(managementZoneObservation)
      .values({
        managementZoneId: input.zoneId,
        userId: currentUser.id,
        body,
        observedOn,
      })
      .returning({ id: managementZoneObservation.id });

    if (!created) {
      throwActionError('Failed to create observation');
    }

    revalidatePath('/');

    return { data: { id: created.id } };
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to create observation');
  }
}

/**
 * Updates an observation on the current user's farm.
 *
 * @param id - Observation id.
 * @param input - Replacement note and observed day.
 * @returns An empty action response.
 */
export async function updateObservation(
  id: number,
  input: UpdateObservationInput
): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();
    assertPositiveId(id, 'observation id');
    const body = normalizeBody(input.body);
    const observedOn = normalizeObservedOn(input.observedOn);

    await assertObservationOnFarm(id, currentUser.farmId);

    await db
      .update(managementZoneObservation)
      .set({
        body,
        observedOn,
        userId: currentUser.id,
      })
      .where(eq(managementZoneObservation.id, id));

    revalidatePath('/');

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to update observation');
  }
}

/**
 * Deletes an observation on the current user's farm.
 *
 * @param id - Observation id.
 * @returns An empty action response.
 */
export async function deleteObservation(id: number): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();
    assertPositiveId(id, 'observation id');
    await assertObservationOnFarm(id, currentUser.farmId);

    await db
      .delete(managementZoneObservation)
      .where(eq(managementZoneObservation.id, id));

    revalidatePath('/');

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to delete observation');
  }
}
