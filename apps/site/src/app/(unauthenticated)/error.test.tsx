// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from './error';

const mockLoggerError = vi.fn();

vi.mock('@/lib/logger', () => ({
  logger: {
    error: (...args: unknown[]) => mockLoggerError(...args),
  },
}));

describe('UnauthenticatedErrorPage', () => {
  it('logs the error on mount', async () => {
    const err = new Error('test failure');
    render(<ErrorPage error={err} reset={() => {}} />);

    await waitFor(() => {
      expect(mockLoggerError).toHaveBeenCalledWith(
        '[unauthenticated] route error boundary',
        expect.objectContaining({ message: 'test failure' })
      );
    });
  });

  it('calls reset when Try again is clicked', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorPage error={new Error('x')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('links to the localized support path', () => {
    render(<ErrorPage error={new Error('x')} reset={() => {}} />);

    const support = screen.getByRole('link', { name: /support/i });
    expect(support).toHaveAttribute('href', '/en/support');
  });
});
