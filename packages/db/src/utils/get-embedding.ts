// Copyright © Todd Agriscience, Inc. All rights reserved.

import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_EMBEDDINGS_KEY;

if (!OPENAI_API_KEY) {
  throw new Error(
    'Missing OPENAI_EMBEDDINGS_KEY. Set it in apps/site/.env.local for local development and in Vercel environment variables for deployed environments.'
  );
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

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
