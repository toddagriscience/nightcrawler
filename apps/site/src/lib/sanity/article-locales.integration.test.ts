// Copyright © Todd Agriscience, Inc. All rights reserved.

// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getArticleBySlug,
  getArticleRoutingInfo,
  getNewsIndexArticles,
  getHighlightedArticlesForPage,
  getPublishedArticleRouteParams,
} from '@/lib/sanity/articles';
import { getArticleAlternates } from '@/lib/sanity/article-locales';
import {
  getArticleCardHref,
  getArticleNavigationUrl,
} from '@/lib/sanity/article-urls';
import sitemap from '@/lib/sitemap';
import { generateMetadata as articleMetadata } from '@/app/(unauthenticated)/[locale]/(marketing)/index/[slug]/layout';

const { documents } = vi.hoisted(() => ({
  documents: [] as Record<string, unknown>[],
}));

vi.mock('@/lib/sanity/client', async () => {
  const { parse, evaluate } = await import('groq-js');
  return {
    SANITY_REVALIDATE: 300,
    defaultSanityFetchOptions: { next: { revalidate: 300 } },
    client: {
      fetch: vi.fn(async (query: string, params: Record<string, unknown>) =>
        (await evaluate(parse(query), { dataset: documents, params })).get()
      ),
    },
  };
});
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}));
vi.mock('@/i18n/config', () => ({
  routing: { locales: ['en', 'es'], defaultLocale: 'en' },
}));
vi.mock('@/lib/env', () => ({
  env: { baseUrl: 'https://toddagriscience.com' },
}));

beforeEach(() => {
  documents.splice(
    0,
    documents.length,
    ...[
      {
        _id: 'legacy',
        slug: { current: 'english-only' },
        title: 'English only',
        translationGroup: 'untranslated',
      },
      {
        _id: 'drafts.legacy-es',
        slug: { current: 'english-only' },
        title: 'Spanish draft',
        language: 'es',
        translationGroup: 'untranslated',
      },
      {
        _id: 'paired-en',
        slug: { current: 'paired' },
        title: 'Paired English',
        language: 'en',
        translationGroup: 'paired',
      },
      {
        _id: 'paired-es',
        slug: { current: 'pareado' },
        title: 'Artículo español',
        language: 'es',
        translationGroup: 'paired',
      },
      {
        _id: 'spanish-only',
        slug: { current: 'solo-espanol' },
        title: 'Solo español',
        language: 'es',
        translationGroup: 'spanish-only',
      },
    ].map((document, index) => ({
      _type: 'news',
      contentType: 'news-company',
      highlightPages: ['homepage'],
      date: `2026-10-0${index + 1}T00:00:00Z`,
      summary: document.title,
      ...document,
    }))
  );
});

describe('published article languages across queries, metadata and sitemaps', () => {
  it('resolves fixed navigation links to the actual Spanish slug or final English fallback', async () => {
    expect(await getArticleNavigationUrl('paired', 'es')).toBe(
      'https://toddagriscience.com/es/index/pareado'
    );
    expect(await getArticleNavigationUrl('english-only', 'es')).toBe(
      'https://toddagriscience.com/index/english-only'
    );
  });
  it('treats legacy documents as English and never exposes a Spanish draft as a route or alternate', async () => {
    const english = await getArticleBySlug('english-only');
    expect(english?.language).toBe('en');
    expect(
      english?.publishedTranslations?.map((variant) => variant.language)
    ).toEqual(['en']);
    expect(await getArticleBySlug('english-only', undefined, 'es')).toBeNull();
    expect(await getArticleRoutingInfo('english-only', 'es')).toBeNull();
    expect(await getPublishedArticleRouteParams('news', 'es')).toEqual([
      { locale: 'es', slug: 'pareado' },
      { locale: 'es', slug: 'solo-espanol' },
    ]);
    expect(getArticleAlternates(english!).languages).toEqual({
      en: 'https://toddagriscience.com/index/english-only',
      'x-default': 'https://toddagriscience.com/index/english-only',
    });
  });

  it('selects the actual Spanish publication and keeps untranslated English entries linked to English', async () => {
    const articles = await getNewsIndexArticles(undefined, 'es');
    expect(articles.map((article) => article.title)).toEqual([
      'Solo español',
      'Artículo español',
      'English only',
    ]);
    expect(articles.map(getArticleCardHref)).toEqual([
      '/es/index/solo-espanol',
      '/es/index/pareado',
      '/index/english-only',
    ]);
    const english = await getNewsIndexArticles();
    expect(english.map((article) => article.title)).toEqual([
      'Paired English',
      'English only',
    ]);
  });

  it('preserves a validated external product destination instead of treating its URL as a path', async () => {
    documents.push({
      _id: 'external-product',
      _type: 'news',
      title: 'External product',
      slug: { current: 'external-product' },
      offSiteUrl: 'https://product.example.com/iris?source=menu',
    });
    expect(await getArticleNavigationUrl('external-product', 'es')).toBe(
      'https://product.example.com/iris?source=menu'
    );
  });

  it('caps highlights after language selection so translated groups do not consume two tiles', async () => {
    const highlights = await getHighlightedArticlesForPage(
      'homepage',
      3,
      undefined,
      'es'
    );
    expect(highlights).toHaveLength(3);
    expect(
      new Set(highlights.map((article) => article.translationGroup)).size
    ).toBe(3);
  });

  it('emits reciprocal self-canonicals and hreflang using each publication’s actual slug', async () => {
    const en = await articleMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'paired' }),
    });
    const es = await articleMetadata({
      params: Promise.resolve({ locale: 'es', slug: 'pareado' }),
    });
    expect(en.alternates?.canonical).toBe(
      'https://toddagriscience.com/index/paired'
    );
    expect(es.alternates?.canonical).toBe(
      'https://toddagriscience.com/es/index/pareado'
    );
    expect(es.alternates?.languages).toEqual(en.alternates?.languages);
    expect(en.alternates?.languages).toEqual({
      en: 'https://toddagriscience.com/index/paired',
      es: 'https://toddagriscience.com/es/index/pareado',
      'x-default': 'https://toddagriscience.com/index/paired',
    });
    expect(es.openGraph && 'url' in es.openGraph && es.openGraph.url).toBe(
      es.alternates?.canonical
    );
  });

  it('includes only published final canonical URLs in the XML child sitemap', async () => {
    const entries = await sitemap({ id: Promise.resolve('main') });
    const articleEntries = entries.filter((entry) =>
      entry.url.includes('/index/')
    );
    expect(articleEntries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        'https://toddagriscience.com/index/english-only',
        'https://toddagriscience.com/index/paired',
        'https://toddagriscience.com/es/index/pareado',
      ])
    );
    expect(
      articleEntries.some(
        (entry) =>
          entry.url === 'https://toddagriscience.com/es/index/english-only'
      )
    ).toBe(false);
    expect(entries.some((entry) => entry.url.includes('/en/'))).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith('/es/'))).toBe(false);
    const untranslated = articleEntries.find((entry) =>
      entry.url.endsWith('/english-only')
    );
    expect(untranslated?.alternates?.languages?.es).toBeUndefined();
  });
});
