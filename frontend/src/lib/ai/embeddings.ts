// Copyright © Todd Agriscience, Inc. All rights reserved.

import { logger } from '@/lib/logger';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generates a vector embedding for a given text using Gemini's embedding model.
 * Returns an array of 768 numbers representing the semantic meaning of the text.
 *
 * @param text - The text to embed
 * @returns Array of 768 numbers
 */
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
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
    console.error('Gemini error:', JSON.stringify(data));
    throw new Error('Embedding failed: ' + response.status);
  }
  return data.embedding.values;
}
