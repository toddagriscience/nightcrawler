//Copyright Todd LLC, All rights reserved.

import { screen, renderWithAct } from '@/test/test-utils';
import NewsHighlightCard from './news-highlight-card';
import '@testing-library/jest-dom';

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

  it('displays carousel placeholder content', async () => {
    await renderWithAct(<NewsHighlightCard />);
    expect(
      screen.getByText('News carousel coming soon...')
    ).toBeInTheDocument();
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
