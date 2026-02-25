// Copyright © Todd Agriscience, Inc. All rights reserved.

import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Generates a vector embedding for a given text using Gemini's embedding model.
 * Returns an array of 768 numbers representing the semantic meaning of the text.
 *
 * @param text - The text to embed
 * @returns Array of 768 numbers
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: { parts: [{ text }] },
  });

  const result = response.embeddings?.[0]?.values;
  if (!result) {
    throw new Error('Embedding failed: missing embedding values');
  }

  return result;
}
