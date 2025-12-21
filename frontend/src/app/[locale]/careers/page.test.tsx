// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  screen,
  renderWithNextIntl,
  fireEvent,
  waitFor,
} from '@/test/test-utils';
import { it, describe, expect, vitest } from 'vitest';
import { act } from '@/test/test-utils';
import Careers from './page';

describe('Contact page', () => {
  it('renders correctly', () => {
    renderWithNextIntl(<Careers />);

    expect(screen.getByText('TODD EXTERNSHIP')).toBeInTheDocument();
  });
  it('sends a message and renders thank you screen', async () => {
    process.env.EXTERNSHIP_GOOGLE_SCRIPT_URL = 'https://google.com';
    window.fetch = vitest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'success',
            success: true,
          }),
      })
    );

    renderWithNextIntl(<Careers />);

    const emailInput = screen.getByTestId('email');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'wsup@gmail.com' } });
    });

    waitFor(() => {
      const submit = screen.getByRole('button');
      act(() => {
        submit.click();
      });
    });

    expect(
      await screen.findByText('SUBMISSION SUCCESSFUL')
    ).toBeInTheDocument();
  });
  it('displays error on failure', async () => {
    process.env.EXTERNSHIP_GOOGLE_SCRIPT_URL = 'https://google.com';
    window.fetch = vitest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            status: 'success',
            success: false,
          }),
      })
    );

    let numConsoleErrors = 0;
    window.console.error = vitest.fn().mockImplementation(() => {
      numConsoleErrors++;
    });

    renderWithNextIntl(<Careers />);

    const emailInput = screen.getByTestId('email');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'wsup@gmail.com' } });
    });

    waitFor(() => {
      const submit = screen.getByRole('button');
      act(() => {
        submit.click();
      });
    });

    await waitFor(() =>
      expect(screen.getByText('Error saving email')).toBeInTheDocument()
    );

    expect(numConsoleErrors).toBeGreaterThanOrEqual(2);
  });
});
