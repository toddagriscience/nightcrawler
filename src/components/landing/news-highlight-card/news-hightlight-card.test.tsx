import { screen, renderWithAct, type Translations } from '@/test/test-utils';
import NewsHighlightCard from './news-hightlight-card';
import '@testing-library/jest-dom';

const customTranslations = {
  'HomePage.newsHighlights.title': 'News Highlights',
  'HomePage.newsHighlights.viewAll': 'View All',
  'HomePage.newsHighlights.placeholder':
    'Carousel component will be implemented here',
} satisfies Translations;

describe('NewsHighlightCard', () => {
  it('renders without crashing', async () => {
    await renderWithAct(<NewsHighlightCard />, {
      translations: customTranslations,
    });
    const sections = screen.getAllByRole('region');
    const newsSection = sections.find(
      (section) => section.getAttribute('id') === 'news-carousel'
    );
    expect(newsSection).toBeInTheDocument();
  });

  it('displays the news highlights heading', async () => {
    await renderWithAct(<NewsHighlightCard />, {
      translations: customTranslations,
    });
    const heading = screen.getByRole('heading', { name: 'News Highlights' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('News Highlights');
  });

  it('renders View All links with correct href', async () => {
    await renderWithAct(<NewsHighlightCard />, {
      translations: customTranslations,
    });
    const viewAllLinks = screen
      .getAllByTestId('button-component')
      .filter((link) => link.getAttribute('href') === '/news');
    expect(viewAllLinks).toHaveLength(2);
  });

  it('displays carousel placeholder content', async () => {
    await renderWithAct(<NewsHighlightCard />, {
      translations: customTranslations,
    });
    expect(
      screen.getByText('Carousel component will be implemented here')
    ).toBeInTheDocument();
  });
});
