import { screen, renderWithAct, type Translations } from '@/test/test-utils';
import Quote from './quote';
import '@testing-library/jest-dom';

const customTranslations = {
  'homepage.quote.text':
    'At Todd, we combine our deep experiance in sustainable agriculture, managing farms and engaging consumers.',
  'homepage.quote.button': 'About',
} satisfies Translations;

describe('Quote', () => {
  it('renders without crashing', async () => {
    await renderWithAct(<Quote isDark={false} />, {
      translations: customTranslations,
    });
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'about-us');
  });

  it('displays the about heading content', async () => {
    await renderWithAct(<Quote isDark={false} />, {
      translations: customTranslations,
    });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/sustainable agriculture/i);
  });

  it('renders the About link with correct href', async () => {
    await renderWithAct(<Quote isDark={false} />, {
      translations: customTranslations,
    });
    const aboutLink = screen.getByTestId('button-component');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).toHaveTextContent('About');
  });

  it('displays loading spinner when isLoading is true', async () => {
    await renderWithAct(<Quote />, { isLoading: true });
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
