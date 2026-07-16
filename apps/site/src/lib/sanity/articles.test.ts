// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getArticleBySlug } from '@/lib/sanity/articles';
import { client, defaultSanityFetchOptions } from '@/lib/sanity/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/sanity/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sanity/client')>();
  return { ...actual, client: { fetch: vi.fn() } };
});

const fetchMock = vi.mocked(client.fetch);

describe('getArticleBySlug', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('applies the default revalidate window when the caller passes no options', async () => {
    await getArticleBySlug('my-article');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      { slug: 'my-article' },
      defaultSanityFetchOptions
    );
  });

  it('lets callers override the fetch options', async () => {
    await getArticleBySlug('my-article', { cache: 'no-store' });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      { slug: 'my-article' },
      { cache: 'no-store' }
    );
  });
});
