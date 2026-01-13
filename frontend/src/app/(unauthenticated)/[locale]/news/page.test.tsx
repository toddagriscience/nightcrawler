// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl, act } from '@/test/test-utils';
import '@testing-library/jest-dom';
import News from './page';
import { vi, describe, it, expect } from 'vitest';

const { items } = vi.hoisted(() => {
  return {
    items: [
      {
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
      {
        thumbnail: {
          url: 'https://example.com/markets.jpg',
          alt: 'Stock market graph',
        },
        title: 'Local Startup Raises $12M in Funding',
        source: 'Bloomberg',
        date: 'November 18, 2024',
        summary:
          'A fast-growing local startup secured new funding to expand its platform and hire additional engineers.',
        link: 'https://bloomberg.com/startup-raises-12m',
        slug: { current: 'breakthrough' },
      },
      {
        title: 'Breakthrough in Renewable Energy Tech',
        isDark: false,
        image: {
          url: 'https://example.com/renewables.jpg',
          alt: 'Solar panels on landscape',
        },
        source: 'Wired',
        date: 'October 2, 2024',
        summary:
          'Researchers unveiled a new renewable energy system that drastically improves efficiency and reduces waste.',
        link: 'https://example.com/news/renewable-energy-breakthrough',
        slug: { current: 'local-startup' },
        thumbnail: {
          url: 'https://example.com/markets.jpg',
          alt: 'Stock market graph',
        },
      },
      {
        title: 'New Security Protocol Announced',
        isDark: false,
        image: {
          url: 'https://example.com/security.jpg',
          alt: 'Digital security illustration',
        },
        source: 'The Verge',
        date: 'September 15, 2024',
        summary:
          'A new security protocol aims to make online communication significantly safer for consumers and businesses.',
        slug: { current: 'new-security' },
        thumbnail: {
          url: 'https://example.com/markets.jpg',
          alt: 'Stock market graph',
        },
      },
      {
        title: 'Global Markets Show Strong Growth',
        isDark: false,
        thumbnail: {
          url: 'https://example.com/markets.jpg',
          alt: 'Stock market graph',
        },
        source: 'Reuters',
        date: 'September 1, 2024',
        summary:
          'Despite ongoing global challenges, markets have shown resilience with steady upward growth.',
        link: 'https://example.com/news/global-markets-growth',
        slug: { current: 'global-markets' },
      },
    ],
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
    default: vi.fn().mockResolvedValue(items),
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
    renderWithNextIntl(await News());

    expect(screen.getByText('Todd Newsroom')).toBeInTheDocument();

    expect(screen.getByText('Latest News')).toBeInTheDocument();
  });
});
