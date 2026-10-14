// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TooltipProvider } from '@/components/ui/tooltip';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArticleIndexPage from './page';

vi.mock('@/lib/get-csp-nonce', () => ({
  getCspNonce: vi.fn(async () => 'a'.repeat(32)),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} {...props} />
  ),
}));

const {
  item,
  getArticleBySlugMock,
  isCareerArticleMock,
  isInternalArticleMock,
} = vi.hoisted(() => {
  const article = {
    title: 'New AI Model Sets Performance Record',
    source: 'TechCrunch',
    date: '2024-11-20T00:00:00.000Z',
    summary:
      'A breakthrough AI model has surpassed previous benchmarks, signaling a major shift in machine learning research.',
    slug: { current: 'new-ai' },
    _type: 'news' as const,
    content: [
      {
        _key: 'ce12009ed6af',
        _type: 'block',
        children: [
          {
            _key: '64e6a6b07265',
            _type: 'span',
            marks: [],
            text: 'Test content.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
    headerImage: {
      _type: 'image',
      alt: 'Header image',
      asset: {
        _ref: 'image-test-asset-2518x1690-png',
        _type: 'reference',
      },
    },
  };
  return {
    item: article,
    getArticleBySlugMock: vi.fn(),
    isCareerArticleMock: vi.fn(),
    isInternalArticleMock: vi.fn(),
  };
});

// Mock embla-carousel-react
vi.mock('embla-carousel-react', () => {
  const mockEmblaApi = {
    scrollSnapList: vi.fn(() => [0, 1, 2]),
    selectedScrollSnap: vi.fn(() => 0),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    scrollTo: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    canScrollPrev: vi.fn(() => true),
    canScrollNext: vi.fn(() => true),
  };

  return {
    __esModule: true,
    default: vi.fn(() => [vi.fn(), mockEmblaApi]),
  };
});

vi.mock('@/lib/sanity/articles', () => ({
  getArticleBySlug: getArticleBySlugMock,
  isInternalArticle: isInternalArticleMock,
  isCareerArticle: isCareerArticleMock,
}));

// The highlight strip is an async server component with its own Sanity read and
// its own tests; the client-side renderer here cannot await it.
vi.mock('../../components/news-highlight-tiles/news-highlight-tiles', () => ({
  NewsHighlightTilesSection: () => <div data-testid="article-highlights" />,
}));

const builder = {
  width: vi.fn().mockReturnThis(),
  height: vi.fn().mockReturnThis(),
  fit: vi.fn().mockReturnThis(),
  src: vi.fn().mockReturnValue('mocked-url'),
  url: vi.fn().mockReturnValue('https://google.com/test.png'),
};

vi.mock('@/lib/sanity/utils', () => {
  return {
    urlFor: vi.fn(() => builder),
  };
});

describe('Article index Page', () => {
  beforeEach(() => {
    getArticleBySlugMock.mockReset();
    isCareerArticleMock.mockReset();
    isInternalArticleMock.mockReset();
    getArticleBySlugMock.mockResolvedValue(item);
    isCareerArticleMock.mockReturnValue(false);
    isInternalArticleMock.mockReturnValue(true);
  });

  it('renders Portable Text headline and formatted date', async () => {
    renderWithNextIntl(
      <TooltipProvider>
        {await ArticleIndexPage({
          params: Promise.resolve({ slug: 'new-ai', locale: 'en' }),
        })}
      </TooltipProvider>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: item.title })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelectorAll('article')).toHaveLength(1);
    expect(document.querySelectorAll('[data-article-body]')).toHaveLength(1);
    const schema = JSON.parse(
      document.querySelector('article script[type="application/ld+json"]')
        ?.textContent ?? '{}'
    );
    expect(document.querySelector('article script')).toHaveAttribute(
      'nonce',
      'a'.repeat(32)
    );
    expect(schema.headline).toBe(item.title);
    expect(schema.description).toBe(item.summary);
    expect(schema.author).toEqual({
      '@type': 'Organization',
      name: 'Todd Agriscience',
    });
    expect(screen.getByText('Todd Agriscience')).toBeInTheDocument();

    const formattedDate = new Date(item.date)
      .toLocaleDateString('en-GB', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .replace(/\s(\d{4})$/, ', $1');

    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText(item.summary)).toBeInTheDocument();
    expect(
      screen.getByText(item.content[0].children[0].text)
    ).toBeInTheDocument();
  });
  it('keeps body headings below the title and safely serializes hostile CMS text', async () => {
    const hostileTitle = '</script><script>alert(1)</script>';
    getArticleBySlugMock.mockResolvedValue({
      ...item,
      title: hostileTitle,
      content: [{ ...item.content[0], style: 'h1' }],
    });
    renderWithNextIntl(
      <TooltipProvider>
        {await ArticleIndexPage({
          params: Promise.resolve({ slug: 'new-ai', locale: 'en' }),
        })}
      </TooltipProvider>
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Test content.' })
    ).toBeInTheDocument();
    expect(document.querySelectorAll('article script')).toHaveLength(1);
    const json = document.querySelector('article script')?.textContent ?? '';
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json).headline).toBe(hostileTitle);
  });
});
