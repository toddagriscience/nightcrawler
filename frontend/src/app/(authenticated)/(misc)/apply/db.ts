// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  farmInfoInternalApplication,
  farmLocation,
  farmSubscription,
} from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { and, eq, inArray } from 'drizzle-orm';

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
        inArray(farmSubscription.status, ['active', 'trialing'])
      )
    )
    .limit(1);

  return Boolean(location && internalApplication && subscription);
}
