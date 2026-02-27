// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useActionState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import Join from './page';

global.ResizeObserver = ResizeObserver;

// Mock useSearchParams and redirect from next/navigation
const mockGet = vi.fn();
const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
  usePathname: () => '/signup',
  redirect: (path: string) => {
    mockRedirect(path);
    // Throw to simulate redirect behavior and stop component rendering
    throw new Error(`NEXT_REDIRECT:${path}`);
  },
}));

// Mock useActionState from React
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => {
  const MockMotionComponent = ({
    children,
    ...props
  }: React.HTMLProps<HTMLDivElement>) => {
    return <div {...props}>{children}</div>;
  };

  return {
    motion: {
      div: MockMotionComponent,
      button: MockMotionComponent,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe('Join Page', () => {
  const validParams: Record<string, string> = {
    first_name: 'John',
    last_name: 'Doe',
    farm_name: 'Green Acres',
    email: 'john@example.com',
    phone: '5551234567',
  };

  beforeEach(() => {
    mockGet.mockClear();
    mockRedirect.mockClear();
    // Default mock for useActionState - no state yet
    (useActionState as Mock).mockReturnValue([null, vi.fn()]);
  });

  describe('form loading with search params', () => {
    it('renders the form correctly when all params are present', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      render(<Join />);

      expect(screen.getByText("You're Almost There!")).toBeInTheDocument();
      expect(
        screen.getByText(
          "You'll use this to login and access your Todd account in the future."
        )
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Create a Password')).toBeInTheDocument();

      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('includes hidden fields with pre-filled values from search params', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      const { container } = render(<Join />);

      // Check hidden inputs have correct values. This is Cursor-ed, and thus doesn't look the best.
      expect(container.querySelector('input[name="firstName"]')).toHaveValue(
        'John'
      );
      expect(container.querySelector('input[name="lastName"]')).toHaveValue(
        'Doe'
      );
      expect(container.querySelector('input[name="farmName"]')).toHaveValue(
        'Green Acres'
      );
      expect(container.querySelector('input[name="email"]')).toHaveValue(
        'john@example.com'
      );
      expect(container.querySelector('input[name="phone"]')).toHaveValue(
        '5551234567'
      );
    });

    it('displays password checklist requirements', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      render(<Join />);

      expect(
        screen.getByText(
          /Please make sure to use a secure password matching the rules./
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/at least 8 characters/)).toBeInTheDocument();
      expect(
        screen.getByText(/contains a special character/)
      ).toBeInTheDocument();
      expect(screen.getByText(/contains a number/)).toBeInTheDocument();
      expect(
        screen.getByText(/contains an uppercase letter/)
      ).toBeInTheDocument();
      expect(screen.getByText(/passwords match/)).toBeInTheDocument();
    });
  });

  describe('redirect when params are missing', () => {
    it('redirects to /contact when first_name is missing', () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'first_name') return null;
        return validParams[key] || null;
      });

      expect(() => render(<Join />)).toThrow('NEXT_REDIRECT:/contact');
      expect(mockRedirect).toHaveBeenCalledWith('/contact');
    });

    it('redirects to /contact when last_name is missing', () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'last_name') return null;
        return validParams[key] || null;
      });

      expect(() => render(<Join />)).toThrow('NEXT_REDIRECT:/contact');
      expect(mockRedirect).toHaveBeenCalledWith('/contact');
    });

    it('redirects to /contact when farm_name is missing', () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'farm_name') return null;
        return validParams[key] || null;
      });

      expect(() => render(<Join />)).toThrow('NEXT_REDIRECT:/contact');
      expect(mockRedirect).toHaveBeenCalledWith('/contact');
    });

    it('redirects to /contact when email is missing', () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'email') return null;
        return validParams[key] || null;
      });

      expect(() => render(<Join />)).toThrow('NEXT_REDIRECT:/contact');
      expect(mockRedirect).toHaveBeenCalledWith('/contact');
    });

    it('redirects to /contact when phone is missing', () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'phone') return null;
        return validParams[key] || null;
      });

      expect(() => render(<Join />)).toThrow('NEXT_REDIRECT:/contact');
      expect(mockRedirect).toHaveBeenCalledWith('/contact');
    });

    it('redirects to /contact when all params are missing', () => {
      mockGet.mockReturnValue(null);

      expect(() => render(<Join />)).toThrow('NEXT_REDIRECT:/contact');
      expect(mockRedirect).toHaveBeenCalledWith('/contact');
    });
  });

  describe('success screen', () => {
    it('shows success screen when action returns without an error', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      // Mock useActionState to return successful state
      (useActionState as Mock).mockReturnValue([
        { data: { user: {}, farm: {} }, error: null },
        vi.fn(),
      ]);

      render(<Join />);

      expect(
        screen.getByText('Your Todd Account Has Been Created!')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please check your email for a verification link.')
      ).toBeInTheDocument();

      // Form should not be visible
      expect(
        screen.queryByText("You're Almost There!")
      ).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
    });

    it('shows form when action has not been submitted yet', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      // Mock useActionState to return null state (initial)
      (useActionState as Mock).mockReturnValue([null, vi.fn()]);

      render(<Join />);

      expect(screen.getByText("You're Almost There!")).toBeInTheDocument();
      expect(
        screen.queryByText('Your Todd Account Has Been Created!')
      ).not.toBeInTheDocument();
    });

    it('shows form with errors when action returns with an error', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      // Mock useActionState to return error state
      (useActionState as Mock).mockReturnValue([
        { error: 'User already exists' },
        vi.fn(),
      ]);

      render(<Join />);

      // Form should still be visible
      expect(screen.getByText("You're Almost There!")).toBeInTheDocument();

      // Error should be displayed
      expect(screen.getByText('User already exists')).toBeInTheDocument();

      // Success screen should not be visible
      expect(
        screen.queryByText('Your Todd Account Has Been Created!')
      ).not.toBeInTheDocument();
    });
  });
});
