// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  screen,
  renderWithNextIntl,
  fireEvent,
  waitFor,
} from '@/test/test-utils';
import Contact from './page';
import { it, describe, expect, vitest, vi } from 'vitest';
import { act } from '@/test/test-utils';
import ResizeObserver from 'resize-observer-polyfill';

// @ts-ignore type error due to lack of types from this polyfill
import IntersectionObserver from 'intersection-observer-polyfill';
import userEvent from '@testing-library/user-event';

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
  it('renders correctly', () => {
    renderWithNextIntl(<Contact />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Farm Name')).toBeInTheDocument();
  });
  it('shows a success screen when entering a business email but not a website', async () => {
    const user = userEvent.setup();

    renderWithNextIntl(<Contact />);

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

    const nextButton = screen.getByTestId('button-next');

    act(() => {
      nextButton.click();
    });

    act(() => {
      nextButton.click();
    });

    const yesButton = screen.getByText('Yes');

    act(() => {
      yesButton.click();
    });

    expect(screen.getByText("It's a match!")).toBeInTheDocument();
  });
  it('shows a failure screen when not entering either a business email or website', async () => {
    const user = userEvent.setup();

    renderWithNextIntl(<Contact />);

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
    await user.type(email, 'jane@gmail.com');

    // Phone
    const phone = screen.getByPlaceholderText(/phone/i);
    await user.type(phone, '555-123-4567');

    const nextButton = screen.getByTestId('button-next');

    act(() => {
      nextButton.click();
    });

    act(() => {
      nextButton.click();
    });

    const yesButton = screen.getByText('Yes');

    act(() => {
      yesButton.click();
    });

    expect(screen.getByText(/Based on your information/)).toBeInTheDocument();
  });
});
