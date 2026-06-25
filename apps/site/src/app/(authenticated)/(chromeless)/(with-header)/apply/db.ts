// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { farmSubscription } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { and, eq, inArray } from 'drizzle-orm';

/** `farmSubscription.status` values that satisfy the ACH-collection gate. */
const BANK_READY_STATUSES = [
  'bank_setup_complete',
  'active',
  'trialing',
] as const;

/**
 * Whether slim onboarding can be submitted (terms accepted).
 *
 * Requires bank information captured on `farmSubscription`. General Business
 * and Farm tabs are no longer part of client onboarding.
 *
 * @param farmId - The applying farm's id
 */
export async function isApplicationReadyForSubmission(
  farmId: number
): Promise<boolean> {
  const [subscription] = await db
    .select({ farmId: farmSubscription.farmId })
    .from(farmSubscription)
    .where(
      and(
        eq(farmSubscription.farmId, farmId),
        inArray(farmSubscription.status, [...BANK_READY_STATUSES])
      )
    )
    .limit(1);

  return Boolean(subscription);
}
