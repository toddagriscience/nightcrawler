// Copyright © Todd Agriscience, Inc. All rights reserved.

import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_EMBEDDINGS_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY ?? 'NOTAKEY',
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
