import { screen, fireEvent, renderWithAct } from '@/test/test-utils';
import type { Translations } from '@/test/test-utils';
import Header from './header';
import '@testing-library/jest-dom';

const customTranslations = {
  'Header.getStarted': 'Get Started',
  'Header.menu.open': 'Open menu',
  'Header.menu.close': 'Close menu',
} satisfies Translations;

describe('Header', () => {
  it('renders without crashing', async () => {
    await renderWithAct(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays menu toggle button', async () => {
    await renderWithAct(<Header />);
    expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
  });

  it('shows TODD wordmark when not in menu mode', async () => {
    await renderWithAct(<Header alwaysGlassy />);
    expect(screen.getByTestId('wordmark-link')).toBeInTheDocument();
  });

  it('toggles menu when menu button is clicked', async () => {
    await renderWithAct(<Header />, { translations: customTranslations });
    const menuButton = screen.getByTestId('menu-toggle');

    await fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('applies dark theme classes when isDark prop is true', async () => {
    await renderWithAct(<Header isDark alwaysGlassy />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveAttribute('data-theme', 'dark');
  });

  it('applies light theme classes when isDark prop is false', async () => {
    await renderWithAct(<Header isDark={false} alwaysGlassy />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveAttribute('data-theme', 'light');
  });

  it('supports keyboard navigation for menu toggle', async () => {
    await renderWithAct(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    await fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await fireEvent.keyDown(menuButton, { key: ' ' });
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('includes Get Started link', async () => {
    await renderWithAct(<Header />);
    const getStartedLink = screen.getByTestId('get-started-link');
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/contact');
  });
});
