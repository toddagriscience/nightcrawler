// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  embedding: vi.fn(),
  transaction: vi.fn(),
  revalidate: vi.fn(),
  error: vi.fn(),
}));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('@nightcrawler/db', () => ({ db: { transaction: mocks.transaction } }));
vi.mock('@nightcrawler/db/utils/get-embedding', () => ({
  getEmbedding: mocks.embedding,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }));
vi.mock('@/lib/logger', () => ({ logger: { error: mocks.error } }));
import { saveGeneralImp } from './actions';

const fields = {
  title: 'Zinc',
  slug: 'zinc',
  tags: 'soil',
  triggerRaw: 'low @zinc',
  content: 'Advice',
};
const date = '2026-01-01T00:00:00.000Z';
beforeEach(() => {
  vi.resetAllMocks();
  mocks.authorize.mockResolvedValue({ id: 7 });
  mocks.embedding.mockResolvedValue([1, 2]);
});

describe('catalog server authorization and atomic edits', () => {
  it('denies callers before validation, embedding or database mutation', async () => {
    mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
    await expect(saveGeneralImp(fields)).rejects.toThrow('Unauthorized');
    expect(mocks.embedding).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it('rejects invalid bodies without calling the embedding service', async () => {
    expect((await saveGeneralImp({ ...fields, content: '' })).ok).toBe(false);
    expect(mocks.embedding).not.toHaveBeenCalled();
  });
  it('keeps the database unchanged when embeddings fail', async () => {
    mocks.embedding.mockRejectedValue(new Error('service unavailable'));
    expect((await saveGeneralImp(fields)).ok).toBe(false);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it('locks the row and refuses stale edits before writing either record', async () => {
    const write = vi.fn();
    const lock = vi.fn().mockResolvedValue([
      {
        id: 1,
        updatedAt: new Date('2026-02-01'),
        slug: 'zinc',
        knowledgeArticleId: 3,
      },
    ]);
    mocks.transaction.mockImplementation((run) =>
      run({
        select: () => ({ from: () => ({ where: () => ({ for: lock }) }) }),
        update: write,
      })
    );
    const result = await saveGeneralImp(fields, { id: 1, updatedAt: date });
    expect(result).toEqual({
      ok: false,
      error: expect.stringContaining('changed since'),
    });
    expect(lock).toHaveBeenCalledWith('update');
    expect(write).not.toHaveBeenCalled();
  });
  it('writes the allowed content and embedding together, retaining existing slug and IDs', async () => {
    const sets: unknown[] = [];
    const record = {
      id: 1,
      slug: 'original-zinc',
      knowledgeArticleId: 3,
      updatedAt: new Date(date),
    };
    mocks.transaction.mockImplementation((run) =>
      run({
        select: () => ({
          from: () => ({ where: () => ({ for: () => [record] }) }),
        }),
        update: () => ({
          set: (values: unknown) => {
            sets.push(values);
            return { where: () => ({ returning: () => [record] }) };
          },
        }),
      })
    );
    const result = await saveGeneralImp(
      {
        ...fields,
        id: 100,
        knowledgeArticleId: 100,
        sourceContentHash: 'forged',
      },
      { id: 1, updatedAt: date }
    );
    expect(result.ok).toBe(true);
    expect(sets).toEqual([
      { embedding: [1, 2] },
      {
        title: 'Zinc',
        slug: 'original-zinc',
        tags: ['soil'],
        triggerRaw: 'low @zinc',
        content: 'Advice',
        sourceContentHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      },
    ]);
  });
});
