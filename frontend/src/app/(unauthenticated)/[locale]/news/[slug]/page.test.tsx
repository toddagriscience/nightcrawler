// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TooltipProvider } from '@/components/ui/tooltip';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import NewsPage from './page';

const { item } = vi.hoisted(() => {
  return {
    item: {
      title: 'New AI Model Sets Performance Record',
      source: 'TechCrunch',
      date: '2024-11-20T00:00:00.000Z',
      summary:
        'A breakthrough AI model has surpassed previous benchmarks, signaling a major shift in machine learning research.',
      slug: { current: 'new-ai' },
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
          _ref: 'image-test-ref',
          _type: 'reference',
        },
      },
    },
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
    default: vi.fn(() => [
      vi.fn(), // emblaRef
      mockEmblaApi, // emblaApi
    ]),
  };
});

vi.mock('@/lib/sanity/query', () => {
  return {
    default: vi.fn().mockResolvedValue(item),
  };
});

const builder = {
  width: vi.fn().mockReturnThis(),
  height: vi.fn().mockReturnThis(),
  src: vi.fn().mockReturnValue('mocked-url'),
  url: vi.fn().mockReturnValue('https://google.com/test.png'),
};

vi.mock('@/lib/sanity/utils', () => {
  return {
    urlFor: vi.fn(() => builder),
  };
});

describe('News Page', () => {
  it('renders without exploding', async () => {
    // ??? tbh idk why this works exactly
    renderWithNextIntl(
      <TooltipProvider>
        {await NewsPage({ params: Promise.resolve({ slug: 'news-article' }) })}
      </TooltipProvider>
    );

    expect(screen.getByText(item.title)).toBeInTheDocument();

    const formattedDate = new Date(item.date)
      .toLocaleDateString('en-GB', {
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
});
