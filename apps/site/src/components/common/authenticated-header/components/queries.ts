// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Cached database queries that power the search dropdown.
 * Each function uses the Next.js 16 `use cache` directive with a one-hour
 * `cacheLife` so results are reused across requests without hitting the DB.
 */

import { cacheLife } from 'next/cache';
import { desc, eq, gt, sql } from 'drizzle-orm';
import {
  integratedManagementPlan,
  knowledgeArticle,
  seedProduct,
} from '@nightcrawler/db/schema';
import { getEmbedding } from '@nightcrawler/db/utils/get-embedding';
import { db } from '@nightcrawler/db/schema/connection';
import { logger } from '@/lib/logger';
import type { DropdownItem, DropdownResults } from './types';

/** Maximum items returned per category in the dropdown. */
const DROPDOWN_LIMIT = 3;

/** Minimum cosine-similarity threshold for dropdown search results. */
const SIMILARITY_THRESHOLD = 0.22;

/**
 * Returns the first 3 IMPs and the first 3 seed products ordered by ID.
 * Used as the default dropdown state when no search query is provided.
 * Results are cached for one hour via the `use cache` directive.
 *
 * @returns Default dropdown results without embedding computation
 */
export async function getDefaultDropdownItems(): Promise<DropdownResults> {
  'use cache';
  cacheLife('hours');

  try {
    const [imps, seeds] = await Promise.all([
      db
        .select({
          id: integratedManagementPlan.id,
          title: integratedManagementPlan.title,
          slug: integratedManagementPlan.slug,
        })
        .from(integratedManagementPlan)
        .orderBy(integratedManagementPlan.id)
        .limit(DROPDOWN_LIMIT),
      db
        .select({
          id: seedProduct.id,
          title: seedProduct.name,
          slug: seedProduct.slug,
        })
        .from(seedProduct)
        .orderBy(seedProduct.id)
        .limit(DROPDOWN_LIMIT),
    ]);

    return {
      imps: imps.map<DropdownItem>((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        resultType: 'imp',
      })),
      seeds: seeds.map<DropdownItem>((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        resultType: 'seed',
      })),
    };
  } catch (error) {
    logger.error('[SearchDropdown] Failed to fetch default items:', error);
    return { imps: [], seeds: [] };
  }
}

/**
 * Searches IMPs and seed products by cosine similarity against the
 * user's query embedding. Returns the top 3 results of each category.
 * Results are cached for one hour per unique query string.
 *
 * @param query - The search text entered by the user
 * @returns Categorized dropdown results ranked by similarity
 */
export async function searchDropdownItems(
  query: string
): Promise<DropdownResults> {
  'use cache';
  cacheLife('hours');

  try {
    const embedding = await getEmbedding(query);
    const embeddingVector = JSON.stringify(embedding);

    /** Shared pgvector similarity expression for normalized knowledge rows. */
    const knowledgeSimilarity = sql<number>`1 - (${knowledgeArticle.embedding} <=> ${embeddingVector}::vector)`;

    const [imps, seeds] = await Promise.all([
      db
        .select({
          id: integratedManagementPlan.id,
          title: integratedManagementPlan.title,
          slug: integratedManagementPlan.slug,
          similarity: knowledgeSimilarity,
        })
        .from(integratedManagementPlan)
        .innerJoin(
          knowledgeArticle,
          eq(knowledgeArticle.id, integratedManagementPlan.knowledgeArticleId)
        )
        .where(gt(knowledgeSimilarity, SIMILARITY_THRESHOLD))
        .orderBy(desc(knowledgeSimilarity))
        .limit(DROPDOWN_LIMIT),
      db
        .select({
          id: seedProduct.id,
          title: seedProduct.name,
          slug: seedProduct.slug,
          similarity: knowledgeSimilarity,
        })
        .from(seedProduct)
        .innerJoin(
          knowledgeArticle,
          eq(knowledgeArticle.id, seedProduct.knowledgeArticleId)
        )
        .where(gt(knowledgeSimilarity, SIMILARITY_THRESHOLD))
        .orderBy(desc(knowledgeSimilarity))
        .limit(DROPDOWN_LIMIT),
    ]);

    return {
      imps: imps.map<DropdownItem>((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        resultType: 'imp',
      })),
      seeds: seeds.map<DropdownItem>((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        resultType: 'seed',
      })),
    };
  } catch (error) {
    logger.error('[SearchDropdown] Search failed:', error);
    return { imps: [], seeds: [] };
  }
}
