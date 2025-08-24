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
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('shows TODD wordmark when not in menu mode', () => {
    render(<Header alwaysGlassy />);
    expect(screen.getByText('TODD')).toBeInTheDocument();
  });

  it('toggles menu when menu button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');

    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('shows navigation menu when menu is open', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');

    fireEvent.click(menuButton);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText('What We Do')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });

  it('highlights active menu item', () => {
    mockUsePathname.mockReturnValue('/who-we-are');
    render(<Header />);

    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);

    const activeItem = screen.getByText('Who We Are').closest('div');
    expect(activeItem).toHaveClass('flex', 'items-center', 'gap-1');
    // Active item should have a dot indicator
    const dot = activeItem?.querySelector('.w-2.h-2.bg-current.rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it('closes menu when navigation link is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');

    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
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
    const menuButton = screen.getByLabelText('Open menu');

    fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    fireEvent.keyDown(menuButton, { key: ' ' });
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('includes Get Started link', () => {
    render(<Header />);
    const getStartedLink = screen.getByText('Get Started');
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink.closest('a')).toHaveAttribute('href', '/contact');
  });
});
