// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import News from './page';

const { getNewsIndexArticlesMock } = vi.hoisted(() => ({
  getNewsIndexArticlesMock: vi.fn(),
}));

vi.mock('@/lib/sanity/articles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sanity/articles')>();
  return {
    ...actual,
    getNewsIndexArticles: getNewsIndexArticlesMock,
  };
});

const NEWS_ITEMS: SanityArticle[] = [
  {
    _id: 'news-1',
    _type: 'news',
    title: 'New AI Model Sets Performance Record',
    slug: { current: 'new-ai' },
    contentType: 'news-company',
    date: '2024-11-20',
    summary: 'A breakthrough AI model has surpassed previous benchmarks.',
  },
  {
    _id: 'news-2',
    _type: 'news',
    title: 'Global Trade Policy Shifts',
    slug: { current: 'global-trade' },
    contentType: 'news-global-affairs',
    date: '2024-11-18',
    summary: 'New affairs across global markets.',
  },
];

function renderPage(searchParams: { count?: string; topic?: string } = {}) {
  return News({
    params: Promise.resolve({ locale: 'en' }),
    searchParams: Promise.resolve(searchParams),
  });
}

describe('News Page', () => {
  beforeEach(() => {
    getNewsIndexArticlesMock.mockReset();
  });

  it('renders the newsroom listing from the news taxonomy', async () => {
    getNewsIndexArticlesMock.mockResolvedValueOnce(NEWS_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Newsroom' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('New AI Model Sets Performance Record')
    ).toBeInTheDocument();
    expect(getNewsIndexArticlesMock).toHaveBeenCalled();
  });

  it('renders query-param topic tabs for present news types', async () => {
    getNewsIndexArticlesMock.mockResolvedValueOnce(NEWS_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute(
      'href',
      '/news'
    );
    expect(screen.getByRole('link', { name: 'Company' })).toHaveAttribute(
      'href',
      '/news?topic=news-company'
    );
    expect(
      screen.getByRole('link', { name: 'Global affairs' })
    ).toHaveAttribute('href', '/news?topic=news-global-affairs');
  });

  it('filters rows by the topic search param', async () => {
    getNewsIndexArticlesMock.mockResolvedValueOnce(NEWS_ITEMS);
    renderWithNextIntl(await renderPage({ topic: 'news-global-affairs' }));

    expect(screen.getByText('Global Trade Policy Shifts')).toBeInTheDocument();
    expect(
      screen.queryByText('New AI Model Sets Performance Record')
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Global affairs' })
    ).toHaveAttribute('aria-current', 'true');
  });

  it('ignores an unknown topic search param (shows all)', async () => {
    getNewsIndexArticlesMock.mockResolvedValueOnce(NEWS_ITEMS);
    renderWithNextIntl(await renderPage({ topic: 'bogus' }));

    expect(
      screen.getByText('New AI Model Sets Performance Record')
    ).toBeInTheDocument();
    expect(screen.getByText('Global Trade Policy Shifts')).toBeInTheDocument();
  });
});
