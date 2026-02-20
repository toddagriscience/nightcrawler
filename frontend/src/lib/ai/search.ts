// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

/**
 * Semantic search over Todd's knowledge base.
 * Embeds the user's query, then finds the closest matching articles using pgvector.
 */

import { logger } from '@/lib/logger';
import { Pool } from 'pg';

const SIMILARITY_THRESHOLD = 0.55;
const MAX_RESULTS = 5;

/**
 * Generates a vector embedding for a query using Gemini.
 *
 * @param text - The search query
 * @returns Array of 3072 numbers
 */
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    logger.error('[Search] Embedding failed:', data);
    throw new Error('Embedding failed');
  }
  return data.embedding.values;
}

/** A single search result returned to the UI */
export interface SearchResult {
  id: number;
  title: string;
  content: string;
  category: string;
  source: string | null;
  similarity: number;
}

/**
 * Searches the knowledge base for articles matching the query.
 * Returns matching articles sorted by relevance, or an empty array
 * if nothing is similar enough (which triggers the "contact advisor" message).
 *
 * @param query - The farmer's search query
 * @returns Array of matching articles with similarity scores
 */
export async function searchKnowledge(query: string): Promise<SearchResult[]> {
  try {
    const embedding = await getEmbedding(query);
    const embeddingStr = '[' + embedding.join(',') + ']';

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    const client = await pool.connect();

    const result = await client.query(
      `SELECT id, title, content, category, source,
              1 - (embedding <=> $1::vector) as similarity
       FROM knowledge_article
       WHERE 1 - (embedding <=> $1::vector) > $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      [embeddingStr, SIMILARITY_THRESHOLD, MAX_RESULTS]
    );

    client.release();
    await pool.end();

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      source: row.source,
      similarity: parseFloat(row.similarity),
    }));
  } catch (error) {
    logger.error('[Search] Search failed:', error);
    throw error;
  }
}