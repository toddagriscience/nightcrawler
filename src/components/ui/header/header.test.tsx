import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from './header';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Header', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays menu toggle button', () => {
    render(<Header />);
    expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
  });

  it('shows TODD wordmark when not in menu mode', () => {
    render(<Header alwaysGlassy />);
    expect(screen.getByTestId('wordmark-link')).toBeInTheDocument();
  });

  it('toggles menu when menu button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('applies dark theme classes when isDark prop is true', () => {
    render(<Header isDark alwaysGlassy />);
    const headerContent = screen.getByRole('banner').querySelector('div > div');
    expect(headerContent).toHaveClass('bg-white/10', 'text-[#FDFDFB]');
  });

  it('applies light theme classes when isDark prop is false', () => {
    render(<Header isDark={false} alwaysGlassy />);
    const headerContent = screen.getByRole('banner').querySelector('div > div');
    expect(headerContent).toHaveClass('bg-black/10', 'text-[#2A2727]');
  });

  it('supports keyboard navigation for menu toggle', () => {
    render(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    fireEvent.keyDown(menuButton, { key: ' ' });
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('includes Get Started link', () => {
    render(<Header />);
    const getStartedLink = screen.getByTestId('get-started-link');
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/contact');
  });
});
