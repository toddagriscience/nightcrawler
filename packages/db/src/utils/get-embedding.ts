// Copyright © Todd Agriscience, Inc. All rights reserved.

import OpenAI from 'openai';

let client: OpenAI | undefined;

/**
 * The embeddings client, built on first use.
 *
 * Resolved here rather than at module load because this module sits on the
 * import path of scripts that never embed anything: `migrate-remote-db.ts`
 * reaches it through `importer-lib` for nothing more than a CLI-flag helper.
 * A module-scope throw took those scripts down wherever no embeddings key is
 * configured — including the Database Compatibility Check, which applies
 * staging migrations and has no reason to hold an OpenAI key.
 *
 * The check itself is unchanged, only its timing: anything that actually asks
 * for an embedding without a key still fails, and fails by name.
 */
function embeddingsClient(): OpenAI {
  const apiKey = process.env.OPENAI_EMBEDDINGS_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing OPENAI_EMBEDDINGS_KEY. Set it in apps/site/.env.local for local development and in Vercel environment variables for deployed environments.'
    );
  }

  client ??= new OpenAI({ apiKey });
  return client;
}

/**
 * Embeds a string with OpenAI's `text-embedding-3-large` model.
 *
 * @param text - Text to embed
 * @returns The embedding vector
 * @throws If OPENAI_EMBEDDINGS_KEY is not set, or the API returns no vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await embeddingsClient().embeddings.create({
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
