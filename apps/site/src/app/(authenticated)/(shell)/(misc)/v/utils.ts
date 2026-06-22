// Copyright © Todd Agriscience, Inc. All rights reserved.

import { seedCrop, seedVariety } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { asc, eq } from 'drizzle-orm';
import type { BrowseCropGroup } from './types';

/**
 * Loads every variety joined to its parent crop, grouped by crop and ordered
 * alphabetically, for the /v browse page.
 */
export async function getVarietiesGroupedByCrop(): Promise<BrowseCropGroup[]> {
  const rows = await db
    .select({
      id: seedVariety.id,
      name: seedVariety.name,
      slug: seedVariety.slug,
      description: seedVariety.description,
      status: seedVariety.status,
      pricePerOzCents: seedVariety.pricePerOzCents,
      pricePerLbCents: seedVariety.pricePerLbCents,
      pricePerPlantCents: seedVariety.pricePerPlantCents,
      cropName: seedCrop.name,
    })
    .from(seedVariety)
    .innerJoin(seedCrop, eq(seedVariety.seedCropId, seedCrop.id))
    .orderBy(asc(seedCrop.name), asc(seedVariety.name));

  const groups = new Map<string, BrowseCropGroup>();
  for (const row of rows) {
    const group = groups.get(row.cropName) ?? {
      cropName: row.cropName,
      varieties: [],
    };
    group.varieties.push(row);
    groups.set(row.cropName, group);
  }
  return Array.from(groups.values());
}
