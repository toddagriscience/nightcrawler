// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  getArticleBySlug,
  getHighlightedArticlesForPage,
} from '@/lib/sanity/articles';
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

describe('getHighlightedArticlesForPage', () => {
  // `mockReset` leaves the mock resolving `undefined`, which is itself a
  // non-array response — the guard below relies on that rather than on a cast
  // through `client.fetch`'s overloaded return type.
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('scopes the query to the requested page and caps it at three tiles', async () => {
    await getHighlightedArticlesForPage('careers');

    const [query, params, options] = fetchMock.mock.calls[0];
    expect(query).toContain('$page in coalesce(highlightPages, [])');
    // The slice bound is interpolated, so an unbounded query would still pass a
    // params-only assertion.
    expect(query).toContain('[0...3]');
    expect(params).toEqual({ page: 'careers' });
    expect(options).toBe(defaultSanityFetchOptions);
  });

  it('orders newest first, falling back to the update time', async () => {
    await getHighlightedArticlesForPage('research');

    expect(fetchMock.mock.calls[0][0]).toContain(
      'order(coalesce(date, _updatedAt) desc)'
    );
  });

  it('coerces a fractional limit into a whole slice bound', async () => {
    await getHighlightedArticlesForPage('about', 2.7);

    expect(fetchMock.mock.calls[0][0]).toContain('[0...2]');
  });

  it('returns an empty list when the query fails', async () => {
    fetchMock.mockRejectedValue(new Error('Sanity is down'));

    await expect(getHighlightedArticlesForPage('article')).resolves.toEqual([]);
  });

  it('returns an empty list when Sanity answers with a non-array', async () => {
    await expect(getHighlightedArticlesForPage('homepage')).resolves.toEqual(
      []
    );
  });
});
