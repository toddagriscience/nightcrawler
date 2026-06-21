// Copyright © Todd Agriscience, Inc. All rights reserved.

import { seedCrop, seedVariety } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';

/** Loads a single variety with its parent crop for the /v/[slug] page. */
export async function getVarietyBySlug(slug: string) {
  const [variety] = await db
    .select({
      id: seedVariety.id,
      name: seedVariety.name,
      slug: seedVariety.slug,
      description: seedVariety.description,
      status: seedVariety.status,
      pricePerOzCents: seedVariety.pricePerOzCents,
      pricePerLbCents: seedVariety.pricePerLbCents,
      pricePerPlantCents: seedVariety.pricePerPlantCents,
      inventoryNote: seedVariety.inventoryNote,
      lastProduced: seedVariety.lastProduced,
      location: seedVariety.location,
      cropName: seedCrop.name,
      cropDescription: seedCrop.description,
    })
    .from(seedVariety)
    .innerJoin(seedCrop, eq(seedVariety.seedCropId, seedCrop.id))
    .where(eq(seedVariety.slug, slug))
    .limit(1);

  return variety;
}
