// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { FeaturedNewsCarousel } from './featured-news-carousel';
import { render } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { SanityDocument } from 'next-sanity';

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

const items = [
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
];

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

describe('FeaturedNewsCarousel', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '3x7sixjh';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  });
  it('renders without imploding', () => {
    render(
      <FeaturedNewsCarousel items={items as unknown as SanityDocument[]} />
    );

    // Should only show the first three articles (assuming we're rendering this on a reasonably sized 16:9 screen)
    expect(
      screen.getByText('New AI Model Sets Performance Record')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Local Startup Raises $12M in Funding')
    ).toBeInTheDocument();

    // Two visible buttons
    const numNavButtons = 2;
    expect(screen.getAllByRole('button')).toHaveLength(numNavButtons);
  });
});
