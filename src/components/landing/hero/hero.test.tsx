import { screen, renderWithNextIntl } from '@/test/test-utils';
import Hero from './hero';
import '@testing-library/jest-dom';

describe('Hero', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Hero />);
    expect(
      screen.getByText('Advancing Agriculture Through Science')
    ).toBeInTheDocument();
  });

  it('displays the hero heading content', () => {
    renderWithNextIntl(<Hero />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Advancing Agriculture Through Science');
  });

  // TODO: Add Spanish translation tests when Jest/NextIntl integration is improved
});
