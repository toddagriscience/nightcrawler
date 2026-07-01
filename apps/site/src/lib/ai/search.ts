// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

/**
 * @fileoverview
 * Semantic search over Todd's knowledge base.
 * Embeds the user's query, then finds the closest matching articles using pgvector.
 */

import { logger } from '@/lib/logger';
import {
  generalImp,
  integratedManagementPlan,
  knowledgeArticle,
  seedProduct,
} from '@nightcrawler/db/schema';
import { getEmbedding } from '@nightcrawler/db/utils/get-embedding';
import { db } from '@nightcrawler/db/schema/connection';
import type { SearchResult } from './types';
import { desc, gt, eq, sql } from 'drizzle-orm';

const SIMILARITY_THRESHOLD = 0.22;
const MAX_RESULTS = 5;

/** Typed IMP search row returned by the Drizzle query. */
interface ImpSearchRow {
  /** IMP database identifier. */
  id: number;
  /** IMP title shown in search. */
  title: string;
  /** IMP slug used for routing. */
  slug: string;
  /** IMP content preview text. */
  content: string;
  /** Optional source attribution. */
  source: string | null;
  /** IMP category label. */
  category: string;
  /** Computed semantic-search similarity. */
  similarity: number;
}

/** Typed general-IMP search row returned by the Drizzle query. */
interface GeneralImpSearchRow {
  /** General-IMP database identifier. */
  id: number;
  /** General-IMP title shown in search. */
  title: string;
  /** General-IMP slug used for routing. */
  slug: string;
  /** General-IMP content preview text. */
  content: string;
  /** Optional source attribution. */
  source: string | null;
  /** General-IMP category label (first tag). */
  category: string;
  /** Computed semantic-search similarity. */
  similarity: number;
}

/** Typed seed-product search row returned by the Drizzle query. */
interface SeedSearchRow {
  /** Seed-product database identifier. */
  id: number;
  /** Seed-product name shown in search. */
  title: string;
  /** Seed-product slug used for routing. */
  slug: string;
  /** Seed-product description preview text. */
  content: string;
  /** Optional source attribution. */
  source: string | null;
  /** Seed-product category label. */
  category: string;
  /** Computed semantic-search similarity. */
  similarity: number;
  /** Remaining stock for the seed product. */
  stock: number;
  /** Price in cents for the seed product. */
  priceInCents: number;
  /** Unit label for the seed product. */
  unit: string;
}

/**
 * Awaits a single knowledge-source query, degrading to an empty result set
 * (and a logged error) if that one source fails. One unavailable table or a
 * lagging migration must not take down the whole assistant — the other sources
 * still return their matches.
 *
 * @param label - Source name for the log line
 * @param query - The Drizzle query to run
 * @returns The rows, or [] if the query throws
 */
async function runSource<T>(
  label: string,
  query: PromiseLike<T[]>
): Promise<T[]> {
  try {
    return await query;
  } catch (error) {
    logger.error(`[Search] ${label} source failed:`, error);
    return [];
  }
}

/**
 * Searches IMP articles, general IMPs, and seed products for a matching query.
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
    /** Shared pgvector similarity expression for normalized knowledge rows. */
    const knowledgeSimilarity = sql<number>`1 - (${knowledgeArticle.embedding} <=> ${embeddingVector}::vector)`;

    const [impResults, generalImpResults, seedResults] = await Promise.all([
      runSource(
        'imp',
        db
          .select({
            id: integratedManagementPlan.id,
            title: integratedManagementPlan.title,
            slug: integratedManagementPlan.slug,
            content: integratedManagementPlan.content,
            source: integratedManagementPlan.source,
            category: sql<string>`${integratedManagementPlan.category}::text`,
            similarity: knowledgeSimilarity,
          })
          .from(integratedManagementPlan)
          .innerJoin(
            knowledgeArticle,
            eq(knowledgeArticle.id, integratedManagementPlan.knowledgeArticleId)
          )
          .where(gt(knowledgeSimilarity, SIMILARITY_THRESHOLD))
          .orderBy(desc(knowledgeSimilarity))
          .limit(MAX_RESULTS)
      ),
      runSource(
        'general-imp',
        db
          .select({
            id: generalImp.id,
            title: sql<string>`coalesce(${generalImp.title}, 'Integrated Management Practice')`,
            slug: generalImp.slug,
            content: generalImp.content,
            source: sql<string | null>`null`,
            category: sql<string>`coalesce(${generalImp.tags}[1], 'general')`,
            similarity: knowledgeSimilarity,
          })
          .from(generalImp)
          .innerJoin(
            knowledgeArticle,
            eq(knowledgeArticle.id, generalImp.knowledgeArticleId)
          )
          .where(gt(knowledgeSimilarity, SIMILARITY_THRESHOLD))
          .orderBy(desc(knowledgeSimilarity))
          .limit(MAX_RESULTS)
      ),
      runSource(
        'seed',
        db
          .select({
            id: seedProduct.id,
            title: seedProduct.name,
            slug: seedProduct.slug,
            content: seedProduct.description,
            source: sql<
              string | null
            >`coalesce(${integratedManagementPlan.source}, 'Todd Seed Catalog')`,
            category: sql<string>`'seed products'`,
            similarity: knowledgeSimilarity,
            stock: seedProduct.stock,
            priceInCents: seedProduct.priceInCents,
            unit: seedProduct.unit,
          })
          .from(seedProduct)
          .innerJoin(
            knowledgeArticle,
            eq(knowledgeArticle.id, seedProduct.knowledgeArticleId)
          )
          .leftJoin(
            integratedManagementPlan,
            eq(
              integratedManagementPlan.id,
              seedProduct.relatedIntegratedManagementPlanId
            )
          )
          .where(gt(knowledgeSimilarity, SIMILARITY_THRESHOLD))
          .orderBy(desc(knowledgeSimilarity))
          .limit(MAX_RESULTS)
      ),
    ]);

    return [
      ...impResults.map<SearchResult>((result: ImpSearchRow) => ({
        id: result.id,
        title: result.title,
        slug: result.slug,
        content: result.content,
        source: result.source,
        category: result.category,
        resultType: 'imp',
        similarity: result.similarity,
        stock: null,
        priceInCents: null,
        unit: null,
      })),
      ...generalImpResults.map<SearchResult>((result: GeneralImpSearchRow) => ({
        id: result.id,
        title: result.title,
        slug: result.slug,
        content: result.content,
        source: result.source,
        category: result.category,
        resultType: 'general-imp',
        similarity: result.similarity,
        stock: null,
        priceInCents: null,
        unit: null,
      })),
      ...seedResults.map<SearchResult>((result: SeedSearchRow) => ({
        id: result.id,
        title: result.title,
        slug: result.slug,
        content: result.content,
        source: result.source,
        category: result.category,
        resultType: 'seed',
        similarity: result.similarity,
        stock: result.stock,
        priceInCents: result.priceInCents,
        unit: result.unit,
      })),
    ]
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, MAX_RESULTS);
  } catch (error) {
    logger.error('[Search] Search failed:', error);
    throw error;
  }
}
