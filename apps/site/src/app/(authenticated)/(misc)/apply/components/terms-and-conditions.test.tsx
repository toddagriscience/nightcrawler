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
  FarmSubscriptionSelect,
  UserSelect,
} from '@/lib/types/db';

/** Builds a typed value matching the farm subscription row shape, with
 * only the fields the component touches. Other consumers of
 * `ApplicationContext` will see `undefined` for the rest, which mirrors
 * how Drizzle returns rows when columns aren't selected.
 */
function farmSubscription(
  status: string | null
): FarmSubscriptionSelect | null {
  if (status === null) {
    return null;
  }
  return { status } as FarmSubscriptionSelect;
}

/** Mock context with canSubmitApplication true so the AGREE button is enabled. */
const mockContextValue = {
  farmInfo: {} as GeneralBusinessInformationUpdate,
  allUsers: [] as UserSelect[],
  currentUser: {} as UserSelect,
  internalApplication: {} as FarmInfoInternalApplicationSelect,
  farmSubscription: farmSubscription('active'),
  invitedUserVerificationStatus: [] as VerificationStatus[],
  setCurrentTab: () => {},
  canSubmitApplication: true,
  canEditFarm: true,
};

/** Renders the component inside ApplicationContext. Provider for tests. */
function renderWithContext(overrides: Partial<typeof mockContextValue> = {}) {
  return render(
    <ApplicationContext.Provider value={{ ...mockContextValue, ...overrides }}>
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
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
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

  it('disables submission for read-only users', () => {
    renderWithContext({ canEditFarm: false });

    expect(
      screen.getByText(
        'Your account is read only. Only administrators can submit the application.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AGREE/i })).toBeDisabled();
  });

  it('renders the terms when the farm only has bank-setup-complete (no subscription)', () => {
    renderWithContext({
      farmSubscription: farmSubscription('bank_setup_complete'),
    });

    // Should show the terms, not the "add your bank information" block.
    expect(
      screen.getByText('Electronic Delivery of Documents')
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/your bank information has not been added yet/i)
    ).not.toBeInTheDocument();
  });

  it('shows the bank-information gate when no subscription/bank row exists', () => {
    renderWithContext({ farmSubscription: farmSubscription(null) });

    expect(
      screen.getByText(/your bank information has not been added yet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add your bank information/i })
    ).toBeInTheDocument();
  });
});
