// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  ArticleContentType,
  SanityArticle,
} from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { NewsHighlightTiles } from './news-highlight-tiles';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}));

vi.mock('@/lib/sanity/utils', () => ({
  urlFor: vi.fn(() => ({
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    url: vi.fn(() => 'https://cdn.sanity.io/images/thumb.jpg'),
  })),
}));

/** Stands in for the `articleIndex.tabs.*` lookup the server component supplies. */
const CATEGORY_LABELS: Partial<Record<ArticleContentType, string>> = {
  'news-company': 'Company',
  'news-research': 'Research',
  'research-publication': 'Publication',
};

const categoryLabel = (type: ArticleContentType) =>
  CATEGORY_LABELS[type] ?? type;

function article(overrides: Partial<SanityArticle> = {}): SanityArticle {
  return {
    _id: 'a1',
    _type: 'news',
    title: 'Next Century of American Agriculture',
    slug: { current: 'next-century' },
    contentType: 'news-company',
    date: '2026-08-01',
    ...overrides,
  };
}

function renderTiles(articles: SanityArticle[], heading = 'Resources') {
  return renderWithNextIntl(
    <NewsHighlightTiles
      articles={articles}
      categoryLabel={categoryLabel}
      heading={heading}
      sectionId="careers-highlights"
    />
  );
}

describe('NewsHighlightTiles', () => {
  it('renders a tile per article with its title and category', () => {
    renderTiles([
      article(),
      article({
        _id: 'a2',
        title: 'Soil Carbon Results',
        slug: { current: 'soil-carbon' },
        contentType: 'news-research',
      }),
      article({
        _id: 'a3',
        title: 'Field Trial Publication',
        slug: { current: 'field-trial' },
        contentType: 'research-publication',
      }),
    ]);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Next Century of American Agriculture',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Publication')).toBeInTheDocument();
  });

  it('renders nothing when no article is highlighted for the page', () => {
    const { container } = renderTiles([]);

    expect(container).toBeEmptyDOMElement();
  });

  it('labels the section with a level-two heading', () => {
    renderTiles([article()]);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Resources',
    });
    expect(heading).toHaveAttribute('id', 'careers-highlights-heading');
    expect(
      screen.getByRole('region', { name: 'Resources' })
    ).toBeInTheDocument();
  });

  it('links internal articles to their canonical detail route', () => {
    renderTiles([article()]);

    expect(
      screen.getByRole('link', { name: /Next Century of American Agriculture/ })
    ).toHaveAttribute('href', '/index/next-century');
  });

  it('opens off-site articles in a new tab', () => {
    renderTiles([article({ offSiteUrl: 'https://example.com/post' })]);

    const link = screen.getByRole('link', {
      name: /Next Century of American Agriculture/,
    });
    expect(link).toHaveAttribute('href', 'https://example.com/post');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a tile unlinked when the CMS href uses an unsafe scheme', () => {
    renderTiles([article({ offSiteUrl: 'javascript:alert(1)' })]);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      screen.getByText('Next Century of American Agriculture')
    ).toBeInTheDocument();
  });

  it('falls back to the placeholder thumbnail when the article has no image', () => {
    renderTiles([article()]);

    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      '/article-placeholder.webp'
    );
  });

  it('requests a square crop for an article thumbnail', () => {
    renderTiles([
      article({
        thumbnail: { asset: { _ref: 'image-abc' }, alt: 'Wheat field' },
      }),
    ]);

    expect(screen.getByRole('img', { name: 'Wheat field' })).toHaveAttribute(
      'src',
      'https://cdn.sanity.io/images/thumb.jpg'
    );
  });
});
