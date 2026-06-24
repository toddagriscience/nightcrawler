// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  ArticleContentType,
  SanityArticle,
} from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ResearchTopicPage from './page';

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

/** Builds a minimal `news` article fixture. */
function article(
  id: string,
  title: string,
  contentType: ArticleContentType,
  date: string
): SanityArticle {
  return {
    _id: id,
    _type: 'news',
    title,
    slug: { current: id },
    contentType,
    date,
    summary: '',
  };
}

const ALL_ITEMS: SanityArticle[] = [
  article('research-1', 'Research Row One', 'research', '2026-04-20'),
  article('story-1', 'Story Row One', 'story', '2026-03-10'),
];

function renderPage(topic: string, count?: string) {
  return ResearchTopicPage({
    params: Promise.resolve({ locale: 'en', topic }),
    searchParams: Promise.resolve(count ? { count } : {}),
  });
}

describe('ResearchTopicPage', () => {
  beforeEach(() => {
    getArticlesByCollectionMock.mockReset();
    vi.mocked(notFound).mockClear();
  });

  it('renders only the active topic and marks its tab current', async () => {
    getArticlesByCollectionMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage('story'));

    expect(screen.getByText('Story Row One')).toBeInTheDocument();
    expect(screen.queryByText('Research Row One')).not.toBeInTheDocument();

    const storyTab = screen.getByRole('link', { name: 'Story' });
    expect(storyTab).toHaveAttribute('aria-current', 'true');
  });

  it('still renders the full tab bar from the whole collection', async () => {
    getArticlesByCollectionMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage('story'));

    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Research' })).toBeInTheDocument();
  });

  it('calls notFound for an unknown topic segment', async () => {
    getArticlesByCollectionMock.mockResolvedValue([]);
    // The harness mocks `notFound` as a no-op, so execution may continue;
    // the contract under test is simply that the guard fires.
    await renderPage('bogus').catch(() => undefined);
    expect(notFound).toHaveBeenCalled();
  });
});
