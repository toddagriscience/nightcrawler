// Copyright © Todd Agriscience, Inc. All rights reserved.

import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_EMBEDDINGS_KEY;

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY ?? 'NOTAKEY',
});

/**
 * Generates a vector embedding for a given text using OpenAI's embedding model.
 * Returns an array of 1536 numbers (default for text-embedding-3-small).
 *
 * @param text - The text to embed
 * @returns Array of numbers
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
    encoding_format: 'float',
  });

  const result = response.data[0]?.embedding;

  if (!result) {
    throw new Error('Embedding failed: missing embedding values');
  }

  return result;
}
