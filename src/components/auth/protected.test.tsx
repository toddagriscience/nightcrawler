// Copyright Todd Agriscience, Inc. All rights reserved.

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import Protected from './protected';
import { redirect, usePathname } from 'next/navigation';

// Mock external dependencies
jest.mock('@/lib/auth', () => ({
  checkAuthenticated: jest.fn(),
}));

import { checkAuthenticated } from '@/lib/auth';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  usePathname: jest.fn(),
}));

describe('<Protected />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading element when busy', async () => {
    render(
      <Protected loadingElement={<div data-testid="loader" />}>
        <div>content</div>
      </Protected>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  test('shows default spinner when no loadingElement is provided', async () => {
    render(
      <Protected>
        <div>content</div>
      </Protected>
    );

    // Default UI shows a spinner
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  test('renders children when authenticated', async () => {
    (checkAuthenticated as jest.Mock).mockResolvedValue(true);

    render(
      <Protected>
        <div data-testid="protected-content">secret</div>
      </Protected>
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  test('redirects when NOT authenticated', async () => {
    (checkAuthenticated as jest.Mock).mockResolvedValue(false);

    render(
      <Protected redirectTo="/en">
        <div>secret</div>
      </Protected>
    );

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/en');
    });
  });
});
