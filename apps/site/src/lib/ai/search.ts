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
import type { SearchResult } from './types';
import { sql } from 'drizzle-orm';

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
    const results = await db.execute(sql`
      with article_matches as (
        select
          article.id,
          article.title,
          article.slug,
          article.content,
          article.source,
          article.category::text as category,
          'imp'::text as result_type,
          1 - (article.embedding <=> ${embeddingVector}::vector) as similarity,
          null::integer as stock,
          null::integer as price_in_cents,
          null::varchar as unit
        from knowledge_article article
        where
          article.article_type = 'imp'
          and 1 - (article.embedding <=> ${embeddingVector}::vector) > ${SIMILARITY_THRESHOLD}
      ),
      seed_matches as (
        select
          product.id,
          product.name as title,
          product.slug,
          product.description as content,
          coalesce(related_imp.source, 'Todd Seed Catalog') as source,
          'seed products'::text as category,
          'seed'::text as result_type,
          1 - (product.embedding <=> ${embeddingVector}::vector) as similarity,
          product.stock,
          product.price_in_cents,
          product.unit
        from seed_product product
        left join knowledge_article related_imp
          on related_imp.id = product.imp_knowledge_article_id
        where 1 - (product.embedding <=> ${embeddingVector}::vector) > ${SIMILARITY_THRESHOLD}
      )
      select *
      from (
        select * from article_matches
        union all
        select * from seed_matches
      ) combined_matches
      order by similarity desc
      limit ${MAX_RESULTS}
    `);

    return results.rows.map((row) => ({
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      content: String(row.content),
      source: row.source ? String(row.source) : null,
      category: String(row.category),
      resultType: row.result_type === 'seed' ? 'seed' : 'imp',
      similarity: Number(row.similarity),
      stock: row.stock === null ? null : Number(row.stock),
      priceInCents:
        row.price_in_cents === null ? null : Number(row.price_in_cents),
      unit: row.unit ? String(row.unit) : null,
    }));
  } catch (error) {
    logger.error('[Search] Search failed:', error);
    throw error;
  }
}
