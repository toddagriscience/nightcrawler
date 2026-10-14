// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { getArticleBySlug } from './articles';
import {
  createArticleMetadata,
  createArticleStructuredData,
} from './article-presentation';

vi.mock('@/lib/sanity/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  const { parse, evaluate } = await import('groq-js');
  const publications = [
    {
      _id: 'english',
      _type: 'news',
      title: 'English',
      slug: { current: 'english' },
      translationGroup: 'paired',
      date: '2026-06-01T12:00:00Z',
      summary: 'English article.',
      editorialOwner: 'Todd Agriscience',
    },
    {
      _id: 'spanish',
      _type: 'news',
      title: 'Español',
      slug: { current: 'espanol' },
      language: 'es',
      translationGroup: 'paired',
      date: '2026-06-02T12:00:00Z',
      dateModified: '2026-06-03T12:00:00Z',
      summary: 'Artículo publicado.',
      editorialOwner: 'Equipo editorial',
    },
    {
      _id: 'drafts.spanish',
      _type: 'news',
      title: 'Unpublished',
      slug: { current: 'draft' },
      language: 'es',
      translationGroup: 'paired',
    },
  ];
  return {
    ...actual,
    client: {
      config: () => actual.client.config(),
      fetch: async (query: string, params: Record<string, unknown>) =>
        (await evaluate(parse(query), { dataset: publications, params })).get(),
    },
  };
});

describe('published article metadata using real GROQ projections', () => {
  it('projects editorial fields and independently published reciprocal language URLs', async () => {
    const article = await getArticleBySlug('espanol', undefined, 'es');
    expect(article).not.toBeNull();
    if (!article) throw new Error('Fixture publication missing');
    expect(article.editorialOwner).toBe('Equipo editorial');
    expect(article.dateModified).toBe('2026-06-03T12:00:00Z');
    const metadata = createArticleMetadata(article);
    expect(metadata.alternates?.languages).toEqual({
      en: expect.stringContaining('/index/english'),
      es: expect.stringContaining('/es/index/espanol'),
      'x-default': expect.stringContaining('/index/english'),
    });
    expect(JSON.stringify(metadata)).not.toContain('/draft');
    expect(createArticleStructuredData(article)).toMatchObject({
      inLanguage: 'es',
      description: 'Artículo publicado.',
      author: { name: 'Equipo editorial' },
      dateModified: article.dateModified,
    });
    expect(await getArticleBySlug('draft', undefined, 'es')).toBeNull();
  });
});
