// Copyright Todd LLC, All rights reserved.

import {
  screen,
  renderWithNextIntl,
  fireEvent,
  waitFor,
} from '@/test/test-utils';
import '@testing-library/jest-dom';
import Contact from './page';
import { act } from 'react';

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
    window.fetch = jest.fn().mockImplementation(() =>
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

      const other = screen.getByTestId('other');
      other.click();
    });

    const submit = screen.getByRole('button');

    act(() => {
      submit.click();
    });

    await waitFor(() =>
      expect(screen.getByText('Thank You')).toBeInTheDocument()
    );
  });
  it('displays error on failure', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
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
    window.console.error = jest.fn().mockImplementation(() => {
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

      const other = screen.getByTestId('other');
      other.click();
    });

    const submit = screen.getByRole('button');

    act(() => {
      submit.click();
    });

    await waitFor(() =>
      expect(
        screen.getByText('HTTP error! status: undefined')
      ).toBeInTheDocument()
    );

    expect(numConsoleErrors).toBeGreaterThanOrEqual(2);
  });
});
