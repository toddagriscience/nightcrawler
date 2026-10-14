// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import proxy from '@/proxy';
import { client } from '@/lib/sanity/client';
import { logger } from '@/lib/logger';

const { documents } = vi.hoisted(() => ({
  documents: [] as Record<string, unknown>[],
}));

vi.mock('@/proxy/auth', () => ({ handleAuthRouting: vi.fn(async () => null) }));
vi.mock('@/lib/sanity/client', async () => {
  const { parse, evaluate } = await import('groq-js');
  return {
    defaultSanityFetchOptions: { next: { revalidate: 300 } },
    client: {
      fetch: vi.fn(async (query: string, params: Record<string, unknown>) =>
        (await evaluate(parse(query), { dataset: documents, params })).get()
      ),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  documents.splice(
    0,
    documents.length,
    { _id: 'english', _type: 'news', slug: { current: 'english-only' } },
    {
      _id: 'drafts.spanish',
      _type: 'news',
      language: 'es',
      slug: { current: 'english-only' },
    },
    {
      _id: 'published-spanish',
      _type: 'news',
      language: 'es',
      slug: { current: 'publicacion-espanola' },
    }
  );
});

describe('published route checks before the app can stream', () => {
  it.each([
    '/index/missing',
    '/es/index/missing',
    '/about/missing',
    '/forms/missing',
    '/es/unknown',
    '/careers/english-only',
    '/es/careers/english-only',
  ])('preserves a real 404 for %s', async (path) => {
    const response = await proxy(
      new NextRequest(`https://toddagriscience.com${path}`)
    );
    expect(response.status).toBe(404);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://toddagriscience.com/__public-not-found/unmatched'
    );
  });
  it('redirects an untranslated Spanish article to final English, ignoring the Spanish draft', async () => {
    const response = await proxy(
      new NextRequest('https://toddagriscience.com/es/index/english-only', {
        headers: { cookie: 'NEXT_LOCALE=es' },
      })
    );
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://toddagriscience.com/index/english-only'
    );
  });
  it('serves an actually published Spanish document with a Spanish request locale', async () => {
    const response = await proxy(
      new NextRequest(
        'https://toddagriscience.com/es/index/publicacion-espanola'
      )
    );
    expect(response.status).toBe(200);
    expect(
      response.headers.get('x-middleware-request-x-next-intl-locale')
    ).toBe('es');
  });
  it('keeps the English publication available with a Spanish cookie and browser preference', async () => {
    const response = await proxy(
      new NextRequest('https://toddagriscience.com/index/english-only', {
        headers: { cookie: 'NEXT_LOCALE=es', 'accept-language': 'es' },
      })
    );
    expect(response.status).toBe(200);
    expect(response.headers.has('location')).toBe(false);
  });
  it('reports an upstream outage as temporary rather than claiming a published article is missing', async () => {
    const logged = vi.spyOn(logger, 'error').mockImplementation(() => {});
    vi.mocked(client.fetch).mockRejectedValueOnce(new Error('CMS unavailable'));
    const response = await proxy(
      new NextRequest('https://toddagriscience.com/index/english-only')
    );
    expect(response.status).toBe(503);
    logged.mockRestore();
  });
});
