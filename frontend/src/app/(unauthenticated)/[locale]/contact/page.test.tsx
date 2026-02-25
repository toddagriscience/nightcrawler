// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Contact from './page';

import { ThemeProvider } from '@/context/theme/ThemeContext';
import userEvent from '@testing-library/user-event';
import contactMessages from '@/messages/contact/en.json';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
// @ts-ignore type error due to lack of types from this polyfill
import IntersectionObserver from 'intersection-observer-polyfill';

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
    <NextIntlClientProvider locale="en" messages={contactMessages}>
      <ThemeProvider>{ui}</ThemeProvider>
    </NextIntlClientProvider>
  );
};

describe('Contact page', () => {
  let container: HTMLElement;

  const getRequiredInput = (name: string) => {
    const input = container.querySelector(
      `input[name="${name}"]`
    ) as HTMLInputElement | null;
    if (!input) {
      throw new Error(`Expected input[name="${name}"] to exist`);
    }
    return input;
  };

  beforeEach(async () => {
    mockPush.mockClear();
    container = renderWithIntl(<Contact />).container;
    const user = userEvent.setup();

    // First name
    const firstName = getRequiredInput('firstName');
    await user.type(firstName, 'Jane');

    // Last name
    const lastName = getRequiredInput('lastName');
    await user.type(lastName, 'Doe');

    // Farm name
    const farmName = getRequiredInput('farmName');
    await user.type(farmName, 'Green Valley Farms');

    // Email
    const email = getRequiredInput('email');
    await user.type(email, 'jane@greenvalley.com');

    // Phone
    const phone = getRequiredInput('phone');
    await user.type(phone, '5551234567');
  });
  it('renders correctly', () => {
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Farm Name')).toBeInTheDocument();
  });
  it('shows a failure screen when not entering either a business email or website', async () => {
    const user = userEvent.setup();

    // Email
    const email = getRequiredInput('email');
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const nextButton = screen.getByRole('button', { name: /continue/i });

    // Click next to move past the first slide
    await user.click(nextButton);

    // Click next to skip the website slide (no website entered)
    await user.click(nextButton);

    // Answer organic question
    const yesButtons = screen.getAllByText('Yes');
    await user.click(yesButtons[0]);

    // Answer hydroponic question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons1 = screen.getAllByText('No');
    await user.click(noButtons1[0]);

    // Answer sprouts question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons2 = screen.getAllByText('No');
    await user.click(noButtons2[0]);

    await waitFor(() => {
      expect(screen.getByText(/Based on your information/)).toBeInTheDocument();
    });
  });
  it('shows failure screen when organic is false and hydroponic is true and produces sprouts is true', async () => {
    const user = userEvent.setup();

    // Email
    const email = getRequiredInput('email');
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const nextButton = screen.getByRole('button', { name: /continue/i });

    // Click next to move past the first slide
    await user.click(nextButton);

    // Click next to skip the website slide (no website entered)
    await user.click(nextButton);

    // Answer organic question
    const yesButtons = screen.getAllByText('Yes');
    await user.click(yesButtons[0]);

    // Answer hydroponic question (No)
    await user.click(yesButtons[1]);

    // Answer sprouts question
    await user.click(yesButtons[2]);

    await waitFor(() => {
      expect(screen.getByText(/Based on your information/)).toBeInTheDocument();
    });
  });

  it('calls router.push with correct URL parameters on successful form submission', async () => {
    const user = userEvent.setup();

    // Clear existing email and set a work email (to skip the website slide)
    const email = getRequiredInput('email');
    await user.clear(email);
    await user.type(email, 'jane@greenvalley.com');

    const nextButton = screen.getByRole('button', { name: /continue/i });

    // Click next to move past the first slide
    await user.click(nextButton);

    // Answer organic question (Yes)
    await waitFor(() => {
      const yesButtons = screen.getAllByText('Yes');
      expect(yesButtons.length).toBeGreaterThan(0);
    });
    const yesButtons = screen.getAllByText('Yes');
    await user.click(yesButtons[0]);

    // Answer hydroponic question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons1 = screen.getAllByText('No');
    await user.click(noButtons1[0]);

    // Answer sprouts question (No)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons2 = screen.getAllByText('No');
    await user.click(noButtons2[0]);

    // Wait for the success screen and click JOIN US
    await waitFor(() => {
      expect(screen.getByText('Join Us')).toBeInTheDocument();
    });

    const joinButton = screen.getByText('Join Us');
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
      expect(calledUrl).toContain('phone=5551234567');
    });
  });
});
