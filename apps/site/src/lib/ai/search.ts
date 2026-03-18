// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

/**
 * @fileoverview
 * Semantic search over Todd's knowledge base.
 * Embeds the user's query, then finds the closest matching articles using pgvector.
 */

import { logger } from '@/lib/logger';
import { getEmbedding } from '@nightcrawler/db/utils/get-embedding';
import { db } from '@nightcrawler/db/schema/connection';
import { knowledgeArticle, seedProduct } from '@nightcrawler/db/schema';
import type { SearchResult } from './types';
import { and, desc, eq, gt, sql } from 'drizzle-orm';

const SIMILARITY_THRESHOLD = 0.22;
const MAX_RESULTS = 5;

/**
 * Searches both IMP articles and seed products for a matching query.
 * Returns mixed results sorted by relevance, or an empty array
 * if nothing is similar enough (which triggers the "contact advisor" message).
 *
 * @param query - The farmer's search query
 * @returns Array of mixed search results with similarity scores
 */
export async function searchKnowledge(query: string): Promise<SearchResult[]> {
  try {
    const embedding = await getEmbedding(query);
    const embeddingVector = JSON.stringify(embedding);
    const articleSimilarity = sql<number>`1 - (${knowledgeArticle.embedding} <=> ${embeddingVector})`;
    const seedSimilarity = sql<number>`1 - (${seedProduct.embedding} <=> ${embeddingVector})`;

    const articleResults = await db
      .select({
        id: knowledgeArticle.id,
        title: knowledgeArticle.title,
        slug: knowledgeArticle.slug,
        content: knowledgeArticle.content,
        source: knowledgeArticle.source,
        category: knowledgeArticle.category,
        similarity: articleSimilarity,
      })
      .from(knowledgeArticle)
      .where(
        and(
          eq(knowledgeArticle.articleType, 'imp'),
          gt(articleSimilarity, SIMILARITY_THRESHOLD)
        )
      )
      .orderBy(desc(articleSimilarity))
      .limit(MAX_RESULTS);

    const seedResults = await db
      .select({
        id: seedProduct.id,
        name: seedProduct.name,
        slug: seedProduct.slug,
        description: seedProduct.description,
        stock: seedProduct.stock,
        priceInCents: seedProduct.priceInCents,
        unit: seedProduct.unit,
        similarity: seedSimilarity,
      })
      .from(seedProduct)
      .where(gt(seedSimilarity, SIMILARITY_THRESHOLD))
      .orderBy(desc(seedSimilarity))
      .limit(MAX_RESULTS);

    return [
      ...articleResults.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        source: article.source ?? null,
        category: article.category,
        resultType: 'imp' as const,
        similarity: article.similarity,
        stock: null,
        priceInCents: null,
        unit: null,
      })),
      ...seedResults.map((seed) => ({
        id: seed.id,
        title: seed.name,
        slug: seed.slug,
        content: seed.description,
        source: 'Todd Seed Catalog',
        category: 'seed products',
        resultType: 'seed' as const,
        similarity: seed.similarity,
        stock: seed.stock,
        priceInCents: seed.priceInCents,
        unit: seed.unit,
      })),
    ]
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, MAX_RESULTS);
  } catch (error) {
    logger.error('[Search] Search failed:', error);
    throw error;
  }
}
