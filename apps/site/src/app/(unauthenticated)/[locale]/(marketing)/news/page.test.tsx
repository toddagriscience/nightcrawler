// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import News from './page';

const { getArticlesByCollectionMock } = vi.hoisted(() => ({
  getArticlesByCollectionMock: vi.fn(),
}));

vi.mock('@/lib/sanity/articles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sanity/articles')>();
  return {
    ...actual,
    getArticlesByCollection: getArticlesByCollectionMock,
  };
});

const NEWS_ITEMS: SanityArticle[] = [
  {
    _id: 'news-1',
    _type: 'news',
    title: 'New AI Model Sets Performance Record',
    slug: { current: 'new-ai' },
    date: '2024-11-20',
    summary: 'A breakthrough AI model has surpassed previous benchmarks.',
  },
  {
    _id: 'news-2',
    _type: 'news',
    title: 'Local Startup Raises $12M in Funding',
    slug: { current: 'local-startup' },
    date: '2024-11-18',
    summary: 'A fast-growing local startup secured new funding.',
  },
];

function renderPage(searchParams: { count?: string } = {}) {
  return News({
    params: Promise.resolve({ locale: 'en' }),
    searchParams: Promise.resolve(searchParams),
  });
}

describe('News Page', () => {
  beforeEach(() => {
    getArticlesByCollectionMock.mockReset();
  });

  it('renders the newsroom listing from the news collection', async () => {
    getArticlesByCollectionMock.mockResolvedValueOnce(NEWS_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Newsroom' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('New AI Model Sets Performance Record')
    ).toBeInTheDocument();
    expect(getArticlesByCollectionMock).toHaveBeenCalledWith('news');
  });

  it('does not render topic tabs (segment is owned by /news/[slug])', async () => {
    getArticlesByCollectionMock.mockResolvedValueOnce(NEWS_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(screen.queryByRole('link', { name: 'All' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Research' })
    ).not.toBeInTheDocument();
  });
});
