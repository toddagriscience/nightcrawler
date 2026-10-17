// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  createArticleMetadata,
  createArticleStructuredData,
  getArticlePresentation,
} from './article-presentation';
import type { SanityArticle } from './article-types';

const publication: SanityArticle = {
  _id: 'publication',
  _type: 'news',
  title: 'Soil research',
  slug: { current: 'soil' },
  date: '2026-06-01T16:00:00Z',
  summary: '\u200e ',
  content: [
    {
      _type: 'block',
      _key: 'first',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'text',
          marks: [],
          text: 'Published research on soil health and farming.',
        },
      ],
    },
  ],
};

describe('article publication facts', () => {
  it('uses real body content for blank legacy summaries and explicit organizational ownership', () => {
    const facts = getArticlePresentation(publication);
    expect(facts.description).toBe(
      'Published research on soil health and farming.'
    );
    expect(facts.owner).toBe('Todd Agriscience');
    expect(facts.hasNamedAuthor).toBe(false);
    const schema = createArticleStructuredData(publication);
    expect(schema.author).toEqual({
      '@type': 'Organization',
      name: facts.owner,
    });
    expect(schema.datePublished).toBe(publication.date);
    expect(schema.dateModified).toBeUndefined();
    expect(schema.image).toEqual([facts.image]);
  });

  it('keeps visible and social information aligned for a separately published Spanish variant', () => {
    const article: SanityArticle = {
      ...publication,
      language: 'es',
      title: 'Suelo',
      author: 'Vincent Todd',
      summary: 'Resumen del estudio.',
      dateModified: '2026-06-03T16:00:00Z',
      slug: { current: 'suelo' },
      publishedTranslations: [
        { _id: 'en', _type: 'news', language: 'en', slug: { current: 'soil' } },
        {
          _id: 'es',
          _type: 'news',
          language: 'es',
          slug: { current: 'suelo' },
        },
      ],
    };
    const facts = getArticlePresentation(article);
    const metadata = createArticleMetadata(article);
    const schema = createArticleStructuredData(article);
    expect(metadata.description).toBe(facts.description);
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      locale: 'es_US',
      url: facts.canonical,
      publishedTime: article.date,
      modifiedTime: article.dateModified,
    });
    expect(metadata.alternates?.languages).toMatchObject({
      en: expect.stringContaining('/index/soil'),
      es: expect.stringContaining('/es/index/suelo'),
    });
    expect(schema).toMatchObject({
      inLanguage: 'es',
      url: facts.canonical,
      author: { '@type': 'Person', name: 'Vincent Todd' },
      dateModified: article.dateModified,
    });
    expect(facts.image).toContain('/api/articles/suelo/image?locale=es');
  });

  it('does not advertise unpublished Spanish alternates or invent missing publication dates', () => {
    const article = {
      ...publication,
      date: undefined,
      _updatedAt: '2026-06-01T00:00:00Z',
    };
    const metadata = createArticleMetadata(article);
    expect(metadata.alternates?.languages).not.toHaveProperty('es');
    expect(createArticleStructuredData(article).datePublished).toBeUndefined();
  });

  it('uses the genuine CMS thumbnail if no header image is set and rejects backwards update dates', () => {
    const article = {
      ...publication,
      dateModified: '2025-06-01T00:00:00Z',
      thumbnail: {
        asset: {
          _ref: 'image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1416x1418-png',
        },
        alt: 'Todd University',
      },
    };
    const facts = getArticlePresentation(article);
    expect(facts.image).toContain('cdn.sanity.io/images/');
    expect(facts.imageAlt).toBe('Todd University');
    expect(facts.dateModified).toBeUndefined();
  });
});
