// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  ArticleContentType,
  SanityArticle,
} from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ResearchIndexPage from './page';

const { getResearchIndexArticlesMock } = vi.hoisted(() => ({
  getResearchIndexArticlesMock: vi.fn(),
}));

vi.mock('@/lib/sanity/articles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sanity/articles')>();
  return {
    ...actual,
    getResearchIndexArticles: getResearchIndexArticlesMock,
  };
});

/** Builds a minimal `news` article fixture. */
function article(
  id: string,
  title: string,
  contentType: ArticleContentType,
  date: string,
  extra: Partial<SanityArticle> = {}
): SanityArticle {
  return {
    _id: id,
    _type: 'news',
    title,
    slug: { current: id },
    contentType,
    date,
    summary: '',
    ...extra,
  };
}

// 9 research rows (R1..R9) fill the first page; story + release fall to page two.
const RESEARCH_ITEMS: SanityArticle[] = Array.from({ length: 9 }, (_, index) =>
  article(
    `research-${index + 1}`,
    `Research Row ${index + 1}`,
    'research',
    `2026-04-${String(20 - index).padStart(2, '0')}`
  )
);
const STORY_ITEM = article('story-1', 'Story Row One', 'story', '2026-03-10');
const RELEASE_ITEM = article(
  'release-1',
  'Release Row One',
  'product-release',
  '2026-03-05'
);
const ALL_ITEMS = [...RESEARCH_ITEMS, STORY_ITEM, RELEASE_ITEM];

function renderPage(searchParams: { count?: string } = {}) {
  return ResearchIndexPage({
    params: Promise.resolve({ locale: 'en' }),
    searchParams: Promise.resolve(searchParams),
  });
}

describe('ResearchIndexPage', () => {
  beforeEach(() => {
    getResearchIndexArticlesMock.mockReset();
  });

  it('renders the heading and the first page of articles', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Research' })
    ).toBeInTheDocument();
    expect(screen.getByText('Research Row 1')).toBeInTheDocument();
    expect(screen.getByText('Research Row 9')).toBeInTheDocument();
    expect(getResearchIndexArticlesMock).toHaveBeenCalled();
  });

  it('renders only content-type tabs that have articles, with path-based hrefs', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute(
      'href',
      '/research/index'
    );
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute(
      'href',
      '/research/index/research'
    );
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute(
      'href',
      '/research/index/story'
    );
    expect(
      screen.getByRole('link', { name: 'Product Release' })
    ).toBeInTheDocument();
    // No `press` articles → no Press tab.
    expect(
      screen.queryByRole('link', { name: 'Press' })
    ).not.toBeInTheDocument();
  });

  it('links each row to its article detail route', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage());

    const row = screen.getByText('Research Row 1').closest('a');
    expect(row).toHaveAttribute(
      'href',
      expect.stringContaining('/index/research-1')
    );
  });

  it('shows View more and hides overflow rows by default', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage());

    expect(screen.getByRole('link', { name: 'View more' })).toHaveAttribute(
      'href',
      '/research/index?count=11'
    );
    expect(screen.queryByText('Release Row One')).not.toBeInTheDocument();
  });

  it('reveals all rows when count covers the remainder', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce(ALL_ITEMS);
    renderWithNextIntl(await renderPage({ count: '20' }));

    expect(screen.getByText('Release Row One')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'View more' })
    ).not.toBeInTheDocument();
  });

  it('shows empty-state copy when there are no articles', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce([]);
    renderWithNextIntl(await renderPage());

    expect(screen.getByText('No entries yet.')).toBeInTheDocument();
  });

  it('never renders a javascript: href from a malicious offSiteUrl', async () => {
    getResearchIndexArticlesMock.mockResolvedValueOnce([
      article('evil-1', 'Evil Row', 'research', '2026-04-21', {
        offSiteUrl: 'javascript:alert(document.cookie)',
      }),
    ]);
    const { container } = renderWithNextIntl(await renderPage());

    // Row is still shown, but not as a link.
    expect(screen.getByText('Evil Row')).toBeInTheDocument();
    expect(screen.getByText('Evil Row').closest('a')).toBeNull();
    expect(container.querySelector('a[href^="javascript:" i]')).toBeNull();
  });
});
