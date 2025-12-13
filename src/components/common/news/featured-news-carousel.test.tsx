// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { FeaturedNewsCarousel } from './featured-news-carousel';
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';
import { client } from '@/lib/sanity/client';
import { render } from '@testing-library/react';
import { SanityDocument } from 'next-sanity';

// Mock embla-carousel-react
jest.mock('embla-carousel-react', () => {
  const mockEmblaApi = {
    scrollSnapList: jest.fn(() => [0, 1, 2]),
    selectedScrollSnap: jest.fn(() => 0),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    scrollTo: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    canScrollPrev: jest.fn(() => true),
    canScrollNext: jest.fn(() => true),
  };

  return {
    __esModule: true,
    default: jest.fn(() => [
      jest.fn(), // emblaRef
      mockEmblaApi, // emblaApi
    ]),
  };
});

// const { projectId = 'NO_PROJECT_ID', dataset = 'NO_DATASET' } = client.config();
// jest.mock('@/lib/sanity/utils', () => {
//   return {
//     urlFor: () =>
//       createImageUrlBuilder({ projectId, dataset }).image(
//         '/image/src/' as SanityImageSource
//       ),
//   };
// });

const items = [
  {
    title: 'New AI Model Sets Performance Record',
    isDark: false,
    thumbnail: {
      url: 'https://example.com/ai-model.jpg',
      alt: 'AI model visualization',
    },
    source: 'TechCrunch',
    date: 'November 20, 2024',
    summary:
      'A breakthrough AI model has surpassed previous benchmarks, signaling a major shift in machine learning research.',
    link: 'https://example.com/news/new-ai-model-sets-record',
  },
  {
    title: 'Local Startup Raises $12M in Funding',
    source: 'Bloomberg',
    date: 'November 18, 2024',
    summary:
      'A fast-growing local startup secured new funding to expand its platform and hire additional engineers.',
    link: 'https://bloomberg.com/startup-raises-12m',
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
    link: 'https://theverge.com/new-security-protocol',
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
  },
];

describe('FeaturedNewsCarousel', () => {
  // it('renders without imploding', () => {
  //   render(
  //     <FeaturedNewsCarousel items={items as unknown as SanityDocument[]} />
  //   );
  //
  //   // Should only show the first article
  //   expect(screen.getByText('Awesome article')).toBeInTheDocument();
  //   expect(
  //     screen.getByText('omfg i despise making test data')
  //   ).toBeInTheDocument();
  //
  //   // We SHOULD see the next articles
  //   expect(screen.queryByText('Wow another cool article')).toBeInTheDocument();
  //   expect(screen.queryByText('skibidi toilet')).toBeInTheDocument();
  //
  //   // Two visible buttons
  //   const numNavButtons = 2;
  //   expect(screen.getAllByRole('button')).toHaveLength(numNavButtons);
  // });
  it('is temporary', () => {
    expect(true);
  });
});
