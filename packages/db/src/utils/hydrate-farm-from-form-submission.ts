// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '../schema/connection';
import { farm, farmCertificate, farmLocation } from '../schema/farm';
import { farmInfoInternalApplication } from '../schema/internal-application';
import { eq, isNull, and } from 'drizzle-orm';
import { mapFormSubmissionAnswersToFarmRecords } from './map-form-submission-answers-to-farm-records';

/**
 * Upserts farm-related rows from mapped form submission answers.
 *
 * @param farmId - Target farm id
 * @param input - Form slug and stored answers
 */
export async function hydrateFarmFromFormSubmission(
  farmId: number,
  input: { formSlug: string; answers: Record<string, unknown> }
): Promise<void> {
  const mapped = mapFormSubmissionAnswersToFarmRecords(input);
  if (!mapped) {
    return;
  }

  if (Object.keys(mapped.farm).length > 0) {
    await db.update(farm).set(mapped.farm).where(eq(farm.id, farmId));
  }

  if (Object.keys(mapped.farmLocation).length > 0) {
    const [existingLocation] = await db
      .select({ farmId: farmLocation.farmId })
      .from(farmLocation)
      .where(eq(farmLocation.farmId, farmId))
      .limit(1);

    if (existingLocation) {
      await db
        .update(farmLocation)
        .set(mapped.farmLocation)
        .where(eq(farmLocation.farmId, farmId));
    } else {
      await db.insert(farmLocation).values({
        ...mapped.farmLocation,
        farmId,
      });
    }
  }

  if (Object.keys(mapped.farmCertificate).length > 0) {
    const [existingCertificate] = await db
      .select({ id: farmCertificate.id })
      .from(farmCertificate)
      .where(eq(farmCertificate.farmId, farmId))
      .limit(1);

    if (existingCertificate) {
      await db
        .update(farmCertificate)
        .set(mapped.farmCertificate)
        .where(eq(farmCertificate.farmId, farmId));
    } else {
      await db.insert(farmCertificate).values({
        ...mapped.farmCertificate,
        farmId,
      });
    }
  }

  if (Object.keys(mapped.farmInfo).length > 0) {
    const [existingInfo] = await db
      .select({ farmId: farmInfoInternalApplication.farmId })
      .from(farmInfoInternalApplication)
      .where(eq(farmInfoInternalApplication.farmId, farmId))
      .limit(1);

    if (existingInfo) {
      await db
        .update(farmInfoInternalApplication)
        .set(mapped.farmInfo)
        .where(eq(farmInfoInternalApplication.farmId, farmId));
    } else {
      await db.insert(farmInfoInternalApplication).values({
        ...mapped.farmInfo,
        farmId,
      });
    }
  }

  if (mapped.advisorNotesMarkdown.length > 0) {
    await db
      .update(farm)
      .set({ advisorProfileNotes: mapped.advisorNotesMarkdown })
      .where(and(eq(farm.id, farmId), isNull(farm.advisorProfileNotes)));
  }
}
