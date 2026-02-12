// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Contact from './page';

import userEvent from '@testing-library/user-event';
// @ts-ignore type error due to lack of types from this polyfill
import { ThemeProvider } from '@/context/theme/ThemeContext';
import IntersectionObserver from 'intersection-observer-polyfill';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

global.ResizeObserver = ResizeObserver;
global.IntersectionObserver = IntersectionObserver;

// Mock for router.push
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// Mock framer-motion
vi.mock('framer-motion', () => {
  const MockMotionComponent = ({
    children,
    ...props
  }: React.HTMLProps<HTMLDivElement>) => {
    const { ...rest } = props;
    return <div {...rest}>{children}</div>;
  };

  return {
    useScroll: vi.fn(() => ({ scrollYProgress: 0 })),
    useMotionValueEvent: vi.fn(),
    motion: {
      div: MockMotionComponent,
      button: MockMotionComponent,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mocks for Embla Carousel, taken from https://github.com/davidjerleke/embla-carousel/blob/master/packages/embla-carousel/src/__tests__/mocks/index.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Helper to render with NextIntl provider
const renderWithIntl = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <ThemeProvider>{ui}</ThemeProvider>
    </NextIntlClientProvider>
  );
};

describe('Contact page', () => {
  beforeEach(async () => {
    mockPush.mockClear();
    renderWithIntl(<Contact />);
    const user = userEvent.setup();

    // First name
    const firstName = screen.getByPlaceholderText(/first name/i);
    await user.type(firstName, 'Jane');

    // Last name
    const lastName = screen.getByPlaceholderText(/last name/i);
    await user.type(lastName, 'Doe');

    // Farm name
    const farmName = screen.getByPlaceholderText(/farm name/i);
    await user.type(farmName, 'Green Valley Farms');

    // Email
    const email = screen.getByPlaceholderText(/email/i);
    await user.type(email, 'jane@greenvalley.com');

    // Phone
    const phone = screen.getByPlaceholderText(/phone/i);
    await user.type(phone, '555-123-4567');
  });
  it('renders correctly', () => {
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Farm Name')).toBeInTheDocument();
  });
  it('shows a failure screen when not entering either a business email or website', async () => {
    const user = userEvent.setup();

    // Email
    const email = screen.getByPlaceholderText(/email/i);
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const nextButton = screen.getByTestId('button-next');

    // Click next to move past the first slide
    act(() => {
      nextButton.click();
    });

    // Click next to skip the website slide (no website entered)
    act(() => {
      nextButton.click();
    });

    // Answer organic question
    const yesButtons = screen.getAllByText('Yes');
    act(() => {
      yesButtons[0].click();
    });

    // Answer hydroponic question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons1 = screen.getAllByText('No');
    act(() => {
      noButtons1[0].click();
    });

    // Answer sprouts question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons2 = screen.getAllByText('No');
    act(() => {
      noButtons2[0].click();
    });

    await waitFor(() => {
      expect(screen.getByText(/Based on your information/)).toBeInTheDocument();
    });
  });
  it('shows failure screen when organic is false and hydroponic is true and produces sprouts is true', async () => {
    const user = userEvent.setup();

    // Email
    const email = screen.getByPlaceholderText(/email/i);
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const nextButton = screen.getByTestId('button-next');

    // Click next to move past the first slide
    act(() => {
      nextButton.click();
    });

    // Click next to skip the website slide (no website entered)
    act(() => {
      nextButton.click();
    });

    // Answer organic question
    const yesButtons = screen.getAllByText('Yes');
    act(() => {
      yesButtons[0].click();
    });

    // Answer hydroponic question (No)
    act(() => {
      yesButtons[1].click();
    });

    // Answer sprouts question
    act(() => {
      yesButtons[2].click();
    });

    await waitFor(() => {
      expect(screen.getByText(/Based on your information/)).toBeInTheDocument();
    });
  });

  it('calls router.push with correct URL parameters on successful form submission', async () => {
    const user = userEvent.setup();

    // Clear existing email and set a work email (to skip the website slide)
    const email = screen.getByPlaceholderText(/email/i);
    await user.clear(email);
    await user.type(email, 'jane@greenvalley.com');

    const nextButton = screen.getByTestId('button-next');

    // Click next to move past the first slide
    act(() => {
      nextButton.click();
    });

    // Answer organic question (Yes)
    await waitFor(() => {
      const yesButtons = screen.getAllByText('Yes');
      expect(yesButtons.length).toBeGreaterThan(0);
    });
    const yesButtons = screen.getAllByText('Yes');
    act(() => {
      yesButtons[0].click();
    });

    // Answer hydroponic question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons1 = screen.getAllByText('No');
    act(() => {
      noButtons1[0].click();
    });

    // Answer sprouts question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons2 = screen.getAllByText('No');
    act(() => {
      noButtons2[0].click();
    });

    // Wait for the success screen and click JOIN US
    await waitFor(() => {
      expect(screen.getByText('JOIN US')).toBeInTheDocument();
    });

    const joinButton = screen.getByText('JOIN US');
    await act(async () => {
      joinButton.click();
    });

    // Verify router.push was called with the correct URL
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      const calledUrl = mockPush.mock.calls[0][0];
      expect(calledUrl).toContain('/signup?');
      expect(calledUrl).toContain('first_name=Jane');
      expect(calledUrl).toContain('last_name=Doe');
      expect(calledUrl).toContain('farm_name=Green+Valley+Farms');
      expect(calledUrl).toContain('email=jane%40greenvalley.com');
      expect(calledUrl).toContain('phone=555-123-4567');
    });
  });
});
