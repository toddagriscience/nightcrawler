// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  farmInfoInternalApplication,
  farmLocation,
  farmSubscription,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { and, eq, inArray } from 'drizzle-orm';

/** `farmSubscription.status` values that satisfy the ACH-collection gate.
 *
 * The application itself only requires that a bank account has been captured
 * (`bank_setup_complete`); active/trialing subscriptions also satisfy the
 * gate so legacy paid farms can still submit.
 */
const BANK_READY_STATUSES = [
  'bank_setup_complete',
  'active',
  'trialing',
] as const;

/** Whether an application has the data required to be submitted.
 *
 * Requires a farm location, an internal-application record, and a
 * `farmSubscription` row whose status indicates bank information has been
 * captured. No payment is taken at submission time.
 *
 * @param {number} farmId - The applying farm's id.
 * @returns {Promise<boolean>} True if the application can be submitted.
 */
export async function isApplicationReadyForSubmission(
  farmId: number
): Promise<boolean> {
  const [location] = await db
    .select({ farmId: farmLocation.farmId })
    .from(farmLocation)
    .where(eq(farmLocation.farmId, farmId))
    .limit(1);

  const [internalApplication] = await db
    .select({ farmId: farmInfoInternalApplication.farmId })
    .from(farmInfoInternalApplication)
    .where(eq(farmInfoInternalApplication.farmId, farmId))
    .limit(1);

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

  return Boolean(location && internalApplication && subscription);
}
