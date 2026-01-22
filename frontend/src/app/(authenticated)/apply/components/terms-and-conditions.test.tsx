// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import TermsAndConditions from './terms-and-conditions';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../actions', () => ({
  submitApplication: vi.fn(),
}));

describe('TermsAndConditions', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the terms and conditions page', () => {
    render(<TermsAndConditions />);

    expect(screen.getByText('Terms and conditions')).toBeInTheDocument();
    expect(
      screen.getByText(/You are about to finalize your Account Application/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /AGREE AND SUBMIT/i })
    ).toBeInTheDocument();
  });

  it('renders the PDF iframe with correct src', () => {
    render(<TermsAndConditions />);

    // Query iframe by tag name since it doesn't have a specific accessible role
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', '/account-agreement.pdf#toolbar=0');
  });

  it('opens dialog when AGREE AND SUBMIT button is clicked', async () => {
    const user = userEvent.setup();
    render(<TermsAndConditions />);

    const triggerButton = screen.getByRole('button', {
      name: /AGREE AND SUBMIT/i,
    });
    await user.click(triggerButton);

    expect(
      screen.getByText('Are you sure you want to submit?')
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/By submitting, you are finalizing your application/)
    ).toHaveLength(2);
    expect(
      screen.getByText(/You will not be able to access your application/)
    ).toBeInTheDocument();
  });

  it('does not display error message initially', () => {
    render(<TermsAndConditions />);

    expect(
      screen.queryByText('There was an error submitting your application.')
    ).not.toBeInTheDocument();
  });
});
