// Copyright © Todd Agriscience, Inc. All rights reserved.

import { standardValues } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';

/** Creates default settings rows for a new farm.
 *
 * Currently this initializes `standard_values` so new farms have baseline
 * thresholds available immediately.
 *
 * @param farmId - The farm to initialize settings for.
 */
export async function createFarmDefaultSettings(farmId: number) {
  await db
    .insert(standardValues)
    .values({ farmId })
    .onConflictDoNothing({ target: standardValues.farmId });
}
