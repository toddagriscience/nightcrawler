import { screen, renderWithAct, type Translations } from '@/test/test-utils';
import Hero from './hero';
import '@testing-library/jest-dom';

const customTranslations = {
  'homepage.hero.title': 'Creating the next-generation organic farms',
} satisfies Translations;

describe('Hero', () => {
  it('renders without crashing', async () => {
    await renderWithAct(<Hero />, { translations: customTranslations });
    expect(
      screen.getByText('Creating the next-generation organic farms')
    ).toBeInTheDocument();
  });

  it('displays the hero heading content', async () => {
    await renderWithAct(<Hero />, { translations: customTranslations });
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'Creating the next-generation organic farms'
    );
  });
});
