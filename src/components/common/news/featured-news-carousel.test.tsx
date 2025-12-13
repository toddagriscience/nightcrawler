// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen } from '@/test/test-utils';
import '@testing-library/vi-dom';
import { FeaturedNewsCarousel } from './featured-news-carousel';
import NewsCardProps from '../news-card/types/news-card';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

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

const items: NewsCardProps[] = [
  {
    title: 'Awesome article',
    excerpt: 'omfg i despise making test data',
    date: '1999',
    link: 'idk.com',
    source: 'blank',
    image: { alt: 'a very cute kitty cat', url: 'https://cutecats.com' },
  },
  {
    title: 'Wow another cool article',
    excerpt: 'skibidi toilet',
    date: '2004',
    link: 'interestingwebsite.com',
    source: 'blank',
    image: { alt: 'a very cute kitty cat', url: 'https://cutecats.com' },
  },
  {
    title: 'the last one',
    excerpt: 'the final one!',
    date: '1934',
    link: 'anoldwebsite.com',
    source: 'blank',
    image: { alt: 'a very cute kitty cat', url: 'https://cutecats.com' },
  },
];

describe('FeaturedNewsCarousel', () => {
  it('renders without imploding', () => {
    render(<FeaturedNewsCarousel items={items} />);

    // Should only show the first article
    expect(screen.getByText('Awesome article')).toBeInTheDocument();
    expect(
      screen.getByText('omfg i despise making test data')
    ).toBeInTheDocument();

    // We SHOULD see the next articles
    expect(screen.queryByText('Wow another cool article')).toBeInTheDocument();
    expect(screen.queryByText('skibidi toilet')).toBeInTheDocument();

    // Two visible buttons
    const numNavButtons = 2;
    expect(screen.getAllByRole('button')).toHaveLength(numNavButtons);
  });
});
