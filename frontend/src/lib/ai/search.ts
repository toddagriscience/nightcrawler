// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

/**
 * @fileoverview
 * Semantic search over Todd's knowledge base.
 * Embeds the user's query, then finds the closest matching articles using pgvector.
 */

import { logger } from '@/lib/logger';
import { db } from '../db/schema/connection';
import { knowledgeArticle } from '../db/schema';
import { asc, gt, sql } from 'drizzle-orm';
import { getEmbedding } from './embeddings';

const SIMILARITY_THRESHOLD = 0.55;
const MAX_RESULTS = 5;

/**
 * Searches the knowledge base for articles matching the query.
 * Returns matching articles sorted by relevance, or an empty array
 * if nothing is similar enough (which triggers the "contact advisor" message).
 *
 * @param query - The farmer's search query
 * @returns Array of matching articles with similarity scores
 */
export async function searchKnowledge(query: string): Promise<
  {
    id: number;
    title: string;
    content: string;
    category: string;
    source: string | null;
    similarity: number;
  }[]
> {
  try {
    const embedding = await getEmbedding(query);

    const results = await db
      .select({
        id: knowledgeArticle.id,
        title: knowledgeArticle.title,
        content: knowledgeArticle.content,
        category: knowledgeArticle.category,
        source: knowledgeArticle.source,
        // Calculate similarity: 1 - distance
        similarity: sql<number>`1 - (${knowledgeArticle.embedding} <=> ${JSON.stringify(embedding)})`,
      })
      .from(knowledgeArticle)
      .where(
        gt(
          sql`1 - (${knowledgeArticle.embedding} <=> ${JSON.stringify(embedding)})`,
          SIMILARITY_THRESHOLD
        )
      )
      .orderBy(
        asc(sql`${knowledgeArticle.embedding} <=> ${JSON.stringify(embedding)}`)
      )
      .limit(MAX_RESULTS);

    return results;
  } catch (error) {
    logger.error('[Search] Search failed:', error);
    throw error;
  }
}
