// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { vi, describe, it, expect } from 'vitest';
import NewsPage from './page';
import { TooltipProvider } from '@/components/ui/tooltip';

const { item } = vi.hoisted(() => {
  return {
    item: {
      title: 'New AI Model Sets Performance Record',
      isDark: false,
      source: 'TechCrunch',
      date: 'November 20, 2024',
      summary:
        'A breakthrough AI model has surpassed previous benchmarks, signaling a major shift in machine learning research.',
      link: 'https://example.com/news/new-ai-model-sets-record',
      slug: { current: 'new-ai' },
      thumbnail: {
        url: 'https://example.com/markets.jpg',
        alt: 'Stock market graph',
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

    expect(
      screen.getByText('New AI Model Sets Performance Record')
    ).toBeInTheDocument();

    expect(screen.getByText('11/20/2024')).toBeInTheDocument();
  });
});
