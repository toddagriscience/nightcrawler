// Copyright © Todd Agriscience, Inc. All rights reserved.

import { knowledgeArticle, seedProduct } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';

/**
 * Loads a seed product by slug for the authenticated product detail page.
 */
export async function getSeedProductBySlug(slug: string) {
  const [product] = await db
    .select({
      id: seedProduct.id,
      name: seedProduct.name,
      slug: seedProduct.slug,
      description: seedProduct.description,
      stock: seedProduct.stock,
      priceInCents: seedProduct.priceInCents,
      unit: seedProduct.unit,
      imageUrl: seedProduct.imageUrl,
      advisorContactUrl: seedProduct.advisorContactUrl,
      relatedImpTitle: knowledgeArticle.title,
      relatedImpSlug: knowledgeArticle.slug,
    })
    .from(seedProduct)
    .leftJoin(
      knowledgeArticle,
      eq(seedProduct.impKnowledgeArticleId, knowledgeArticle.id)
    )
    .where(eq(seedProduct.slug, slug))
    .limit(1);

  return product;
}
