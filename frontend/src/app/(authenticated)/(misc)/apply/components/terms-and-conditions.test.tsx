// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TermsAndConditions from './terms-and-conditions';
import { ApplicationContext } from './application-tabs';
import type {
  GeneralBusinessInformationUpdate,
  VerificationStatus,
} from '../types';
import type {
  FarmInfoInternalApplicationSelect,
  UserSelect,
} from '@/lib/types/db';

/** Mock context with canSubmitApplication true so the AGREE button is enabled. */
const mockContextValue = {
  farmInfo: {} as GeneralBusinessInformationUpdate,
  allUsers: [] as UserSelect[],
  currentUser: {} as UserSelect,
  internalApplication: {} as FarmInfoInternalApplicationSelect,
  invitedUserVerificationStatus: [] as VerificationStatus[],
  setCurrentTab: () => {},
  canSubmitApplication: true,
};

/** Renders the component inside ApplicationContext. Provider for tests. */
function renderWithContext() {
  return render(
    <ApplicationContext.Provider value={mockContextValue}>
      <TermsAndConditions />
    </ApplicationContext.Provider>
  );
}

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
    renderWithContext();

    expect(
      screen.getByText('Electronic Delivery of Documents')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You are about to finalize your Account Application/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AGREE/i })).toBeInTheDocument();
  });

  it('opens dialog when AGREE AND SUBMIT button is clicked', async () => {
    const user = userEvent.setup();
    renderWithContext();

    const triggerButton = screen.getByRole('button', {
      name: /AGREE/i,
    });
    await user.click(triggerButton);

    expect(
      screen.getByText('Are you sure you want to submit?')
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/By submitting, you are finalizing your application/)
    ).toHaveLength(2);
    expect(
      screen.getByText(
        /You will not be able to edit your application or resubmit it/
      )
    ).toBeInTheDocument();
  });

  it('does not display error message initially', () => {
    renderWithContext();

    expect(
      screen.queryByText('There was an error submitting your application.')
    ).not.toBeInTheDocument();
  });
});
