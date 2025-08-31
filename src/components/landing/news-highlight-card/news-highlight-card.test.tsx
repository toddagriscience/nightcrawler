// Copyright Todd LLC, All rights reserved.

import { screen, renderWithAct } from '@/test/test-utils';
import NewsHighlightCard from './news-highlight-card';
import '@testing-library/jest-dom';

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

describe('NewsHighlightCard', () => {
  it('renders without crashing', async () => {
    await renderWithAct(<NewsHighlightCard />);
    const sections = screen.getAllByRole('region');
    const newsSection = sections.find(
      (section) => section.getAttribute('id') === 'news-carousel'
    );
    expect(newsSection).toBeInTheDocument();
  });

  it('displays the news highlights heading', async () => {
    await renderWithAct(<NewsHighlightCard />);
    const heading = screen.getByRole('heading', { name: 'News Highlights' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('News Highlights');
  });

  it('renders View All links with correct href', async () => {
    await renderWithAct(<NewsHighlightCard />);
    const viewAllLinks = screen
      .getAllByTestId('button-component')
      .filter((link) => link.getAttribute('href') === '/news');
    expect(viewAllLinks).toHaveLength(2);
  });

  it('displays news articles from JSON data', async () => {
    await renderWithAct(<NewsHighlightCard />);
    expect(
      screen.getByText(
        'Todd Announces Partnership with Agricultural Innovation Lab'
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Journal.*Apr 15, 2025/)).toBeInTheDocument();
  });

  it('renders normally without isLoading prop', async () => {
    await renderWithAct(<NewsHighlightCard />);
    const sections = screen.getAllByRole('region');
    const newsSection = sections.find(
      (section) => section.getAttribute('id') === 'news-carousel'
    );
    expect(newsSection).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'News Highlights' })
    ).toBeInTheDocument();
  });
});
