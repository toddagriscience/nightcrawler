// Copyright © Todd Agriscience, Inc. All rights reserved.

import { act, renderWithNextIntl, screen, waitFor } from '@/test/test-utils';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Contact from './page';

// @ts-ignore type error due to lack of types from this polyfill
import userEvent from '@testing-library/user-event';
import IntersectionObserver from 'intersection-observer-polyfill';

global.ResizeObserver = ResizeObserver;
global.IntersectionObserver = IntersectionObserver;

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

describe('Contact page', () => {
  beforeEach(async () => {
    renderWithNextIntl(<Contact />);
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
  it('shows a success screen when entering a business email but not a website', async () => {
    const nextButton = screen.getByTestId('button-next');

    // Click next to move past the first slide (no website slide for work emails)
    act(() => {
      nextButton.click();
    });

    // Answer organic question (Yes or No - either works for match)
    // Use getAllByText and select the first "Yes" button (organic question)
    const yesButtons = screen.getAllByText('Yes');
    act(() => {
      yesButtons[0].click();
    });

    // Answer hydroponic question (No for match)
    // After clicking, the carousel moves, so the first "No" button is now the hydroponic one
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons1 = screen.getAllByText('No');
    act(() => {
      noButtons1[0].click();
    });

    // Answer sprouts question (No for match)
    await waitFor(() => {
      const noButtons = screen.getAllByText('No');
      expect(noButtons.length).toBeGreaterThan(0);
    });
    const noButtons2 = screen.getAllByText('No');
    act(() => {
      noButtons2[0].click();
    });

    await waitFor(() => {
      expect(screen.getByText("It's a match!")).toBeInTheDocument();
    });
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
});
