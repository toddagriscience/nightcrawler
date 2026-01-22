// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, afterEach, expect, vi, Mock } from 'vitest';
import TermsAndConditions from './terms-and-conditions';
import { submitApplication } from '../actions';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';

vi.mock('../actions', () => ({
  submitApplication: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('TermsAndConditions', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    (useRouter as Mock).mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the terms page and iframe', () => {
    render(<TermsAndConditions />);

    expect(screen.getByText(/Terms and conditions/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /agree and submit/i })
    ).toBeInTheDocument();

    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', '/account-agreement.pdf#toolbar=0');
  });

  it('opens the confirmation dialog', () => {
    render(<TermsAndConditions />);

    const user = userEvent.setup();

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    expect(
      screen.getByText(/Are you sure you want to submit/i)
    ).toBeInTheDocument();
  });

  it('keeps final submit disabled until wait time passes', async () => {
    render(<TermsAndConditions />);

    const user = userEvent.setup();

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    const finalSubmit = screen.getByRole('button', {
      name: /agree and submit/i,
    });

    expect(finalSubmit).toBeDisabled();

    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(finalSubmit).not.toBeDisabled();
    });
  });

  it('submits successfully and navigates to success page', async () => {
    (submitApplication as Mock).mockResolvedValue({
      error: null,
    });

    const user = userEvent.setup();

    render(<TermsAndConditions />);

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    vi.advanceTimersByTime(5000);

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    await waitFor(() => {
      expect(submitApplication).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/application-success');
    });
  });

  it('shows an error message when submission returns an error', async () => {
    (submitApplication as Mock).mockResolvedValue({
      error: true,
    });

    const user = userEvent.setup();

    render(<TermsAndConditions />);

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    vi.advanceTimersByTime(5000);

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/There was an error submitting your application/i)
      ).toBeInTheDocument();
    });
  });

  it('shows an error message when submission throws', async () => {
    (submitApplication as Mock).mockRejectedValue(new Error('boom'));

    render(<TermsAndConditions />);

    const user = userEvent.setup();

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    vi.advanceTimersByTime(5000);

    act(() => {
      user.click(screen.getByRole('button', { name: /agree and submit/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/There was an error submitting your application/i)
      ).toBeInTheDocument();
    });
  });
});
