// Copyright © Todd Agriscience, Inc. All rights reserved.

import { seedProduct } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { desc } from 'drizzle-orm';

export async function getAllSeedProducts() {
  return db
    .select({
      id: seedProduct.id,
      name: seedProduct.name,
      slug: seedProduct.slug,
      description: seedProduct.description,
      stock: seedProduct.stock,
      priceInCents: seedProduct.priceInCents,
      unit: seedProduct.unit,
      imageUrl: seedProduct.imageUrl,
    })
    .from(seedProduct)
    .orderBy(desc(seedProduct.updatedAt));
}
