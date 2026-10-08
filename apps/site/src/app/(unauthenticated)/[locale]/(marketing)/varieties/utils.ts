// Copyright © Todd Agriscience, Inc. All rights reserved.

import { seedCrop, seedVariety } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { asc, eq } from 'drizzle-orm';
import type { PublicVariety } from './types';

/**
 * Loads every variety joined to its parent crop, for the public variety
 * list. Intentionally omits pricing, inventory, and storage fields, which
 * are internal-only.
 */
export async function getPublicVarieties(): Promise<PublicVariety[]> {
  return db
    .select({
      id: seedVariety.id,
      name: seedVariety.name,
      description: seedVariety.description,
      status: seedVariety.status,
      cropName: seedCrop.name,
    })
    .from(seedVariety)
    .innerJoin(seedCrop, eq(seedVariety.seedCropId, seedCrop.id))
    .orderBy(asc(seedCrop.name), asc(seedVariety.name));
}
