import { screen, fireEvent, renderWithNextIntl } from '@/test/test-utils';
import Header from './header';
import '@testing-library/jest-dom';

describe('Header', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays menu toggle button', () => {
    renderWithNextIntl(<Header />);
    expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
  });

  it('shows TODD wordmark when not in menu mode', () => {
    renderWithNextIntl(<Header alwaysGlassy />);
    expect(screen.getByTestId('wordmark-link')).toBeInTheDocument();
  });

  it('toggles menu when menu button is clicked', async () => {
    renderWithNextIntl(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    await fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('applies dark theme classes when isDark prop is true', () => {
    renderWithNextIntl(<Header isDark alwaysGlassy />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveAttribute('data-theme', 'dark');
  });

  it('applies light theme classes when isDark prop is false', () => {
    renderWithNextIntl(<Header isDark={false} alwaysGlassy />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveAttribute('data-theme', 'light');
  });

  it('supports keyboard navigation for menu toggle', async () => {
    renderWithNextIntl(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    await fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await fireEvent.keyDown(menuButton, { key: ' ' });
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('includes Get Started link', () => {
    renderWithNextIntl(<Header />);
    const getStartedLink = screen.getByTestId('get-started-link');
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/contact');
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
  });
});
