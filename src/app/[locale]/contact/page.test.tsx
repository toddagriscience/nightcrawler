// Copyright Todd Agriscience, Inc. All rights reserved.

import {
  screen,
  renderWithNextIntl,
  fireEvent,
  waitFor,
} from '@/test/test-utils';
import Contact from './page';
import { it, describe, expect, vitest } from 'vitest';
import { act } from '@/test/test-utils';

describe('Contact page', () => {
  it('renders correctly', () => {
    renderWithNextIntl(<Contact />);

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });
  it('dropdown works', () => {
    renderWithNextIntl(<Contact />);

    const select = screen.getByRole('combobox');
    act(() => {
      select.click();
    });

    expect(screen.getAllByText('General Inquiry')).toHaveLength(2);
    expect(screen.getAllByText('Other')).toHaveLength(2);

    const other = screen.getByTestId('other');

    act(() => {
      other.click();
    });

    expect(select.nodeValue == 'Other');
  });
  it('sends a message and renders thank you screen', async () => {
    process.env.GOOGLE_SCRIPT_URL = 'https://google.com';
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

    renderWithNextIntl(<Contact />);

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const message = screen.getByTestId('message-input');
    const select = screen.getByRole('combobox');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'bobby' } });
      fireEvent.change(emailInput, { target: { value: 'wsup@gmail.com' } });
      fireEvent.change(message, { target: { value: 'cba' } });
      select.click();
    });

    waitFor(() => {
      const other = screen.getByTestId('other');
      act(() => {
        other.click();
      });
    });

    waitFor(() => {
      const submit = screen.getByRole('button');
      act(() => {
        submit.click();
      });
    });

    expect(await screen.findByText('Thank You')).toBeInTheDocument();
  });
  it('displays error on failure', async () => {
    process.env.GOOGLE_SCRIPT_URL = 'https://google.com';
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

    renderWithNextIntl(<Contact />);

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const message = screen.getByTestId('message-input');
    const select = screen.getByRole('combobox');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'bobby' } });
      fireEvent.change(emailInput, { target: { value: 'wsup@gmail.com' } });
      fireEvent.change(message, { target: { value: 'cba' } });
      select.click();

      waitFor(() => {
        const other = screen.getByTestId('other');
        other.click();
      });
    });

    waitFor(() => {
      const submit = screen.getByRole('button');
      act(() => {
        submit.click();
      });
    });

    await waitFor(() =>
      expect(
        screen.getByText('HTTP error! status: undefined')
      ).toBeInTheDocument()
    );

    expect(numConsoleErrors).toBeGreaterThanOrEqual(2);
  });
});
