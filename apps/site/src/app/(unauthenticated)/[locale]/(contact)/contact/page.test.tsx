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

const createEmblaApi = () => {
  let selectedIndex = 0;
  const listenersByEvent = new Map<string, Set<() => void>>();

  const emit = (event: string) => {
    const callbacks = listenersByEvent.get(event);
    if (!callbacks) return;
    callbacks.forEach((callback) => callback());
  };

  return {
    scrollSnapList: vi.fn(() => [0, 1, 2, 3, 4, 5]),
    selectedScrollSnap: vi.fn(() => selectedIndex),
    scrollPrev: vi.fn(() => {
      if (selectedIndex > 0) {
        selectedIndex -= 1;
        emit('select');
      }
    }),
    scrollNext: vi.fn(() => {
      if (selectedIndex < 5) {
        selectedIndex += 1;
        emit('select');
      }
    }),
    scrollTo: vi.fn((index: number) => {
      selectedIndex = index;
      emit('select');
    }),
    slideNodes: vi.fn(() => new Array(6).fill(null)),
    canScrollPrev: vi.fn(() => selectedIndex > 0),
    canScrollNext: vi.fn(() => selectedIndex < 5),
    on: vi.fn((event: string, callback: () => void) => {
      const callbacks = listenersByEvent.get(event) ?? new Set<() => void>();
      callbacks.add(callback);
      listenersByEvent.set(event, callbacks);
    }),
    off: vi.fn((event: string, callback: () => void) => {
      const callbacks = listenersByEvent.get(event);
      if (!callbacks) return;
      const remaining = new Set(
        Array.from(callbacks).filter((entry) => entry !== callback)
      );
      listenersByEvent.set(event, remaining);
    }),
  };
};

let mockEmblaApi = createEmblaApi();

// Mock embla-carousel-react to allow slide navigation in tests
vi.mock('embla-carousel-react', () => {
  return {
    __esModule: true,
    default: vi.fn(() => [vi.fn(), mockEmblaApi]),
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
    mockEmblaApi = createEmblaApi();
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
    await user.clear(phone);
    await user.type(phone, '5551234567');
  });
  it('renders correctly', () => {
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Farm Name')).toBeInTheDocument();
  });
  it('disables continue when no work email or website', async () => {
    const user = userEvent.setup();

    // Email
    const email = getRequiredInput('email');
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const nextButton = screen.getByRole('button', { name: /continue/i });

    // Click next to move past the first slide
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    await screen.findByPlaceholderText('https://');

    // Website is required when no work email is provided
    await waitFor(() => expect(nextButton).toBeDisabled());
  });
  it('shows failure screen when organic is false and hydroponic is true and produces sprouts is true', async () => {
    const user = userEvent.setup();

    // Email
    const email = getRequiredInput('email');
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const nextButton = screen.getByRole('button', { name: /continue/i });

    // Click next to move past the first slide
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    // Website (required for non-work email)
    const website = getRequiredInput('website');
    await user.type(website, 'https://example.com');
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    // Answer organic question (No)
    const noButtons = screen.getAllByText('No');
    await user.click(noButtons[0]);
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    // Answer hydroponic question (Yes)
    const yesButtons = screen.getAllByText('Yes');
    await user.click(yesButtons[1]);
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    // Answer sprouts question (Yes)
    const yesButtons2 = screen.getAllByText('Yes');
    await user.click(yesButtons2[2]);
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Based on your information/)).toBeInTheDocument();
    });
  });

  it('calls router.push with correct URL parameters on successful form submission', async () => {
    const user = userEvent.setup();

    // Use a non-work email and provide a website
    const email = getRequiredInput('email');
    await user.clear(email);
    await user.type(email, 'jane@gmail.com');

    const website = await screen.findByPlaceholderText('https://');
    await user.type(website, 'https://example.com');

    // Answer questions to qualify for match
    await waitFor(() => {
      const yesButtons = screen.getAllByRole('button', { name: 'Yes' });
      const noButtons = screen.getAllByRole('button', { name: 'No' });
      expect(yesButtons.length).toBeGreaterThanOrEqual(3);
      expect(noButtons.length).toBeGreaterThanOrEqual(3);
    });
    const yesButtons = screen.getAllByRole('button', { name: 'Yes' });
    const noButtons = screen.getAllByRole('button', { name: 'No' });
    await user.click(yesButtons[0]);
    await user.click(noButtons[1]);
    await user.click(noButtons[2]);

    const joinButton = await screen.findByText('Join Us');

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
      expect(calledUrl).toContain('email=jane%40gmail.com');
      expect(calledUrl).toContain('phone=5551234567');
    });
  });
});
