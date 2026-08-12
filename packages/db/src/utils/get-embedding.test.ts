// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const savedKey = process.env.OPENAI_EMBEDDINGS_KEY;

beforeEach(() => {
  vi.resetModules();
  delete process.env.OPENAI_EMBEDDINGS_KEY;
});

afterEach(() => {
  if (savedKey === undefined) {
    delete process.env.OPENAI_EMBEDDINGS_KEY;
  } else {
    process.env.OPENAI_EMBEDDINGS_KEY = savedKey;
  }
});

describe('get-embedding', () => {
  it('imports without a key configured', async () => {
    // The regression this guards: a module-scope throw here took down every
    // script that merely sits downstream of this import. `migrate-remote-db`
    // reaches it through `importer-lib` for a CLI-flag helper and never embeds
    // anything, so importing must stay free of side effects.
    await expect(import('./get-embedding')).resolves.toHaveProperty(
      'getEmbedding'
    );
  });

  it('still fails by name when an embedding is actually requested', async () => {
    const { getEmbedding } = await import('./get-embedding');
    await expect(getEmbedding('some text')).rejects.toThrow(
      /OPENAI_EMBEDDINGS_KEY/
    );
  });
});
