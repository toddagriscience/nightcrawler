// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TermsAndConditions from '@/app/(onboarding)/apply/components/terms-and-conditions';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock(
  '@/app/(authenticated)/components/account-agreement/account-agreement-confirmation',
  () => ({
    default: ({
      disabled,
      onConfirm,
      onError,
    }: {
      disabled: boolean;
      onConfirm: () => Promise<void>;
      onError: () => void;
    }) => (
      <button
        disabled={disabled}
        onClick={() => void onConfirm().catch(onError)}
      >
        Agree and submit
      </button>
    ),
  })
);
const submit = vi.fn(ONBOARDING_CONTEXT.actions.submitApplication);
function renderWithContext(overrides: Partial<OnboardingContextValue> = {}) {
  return render(
    <ApplicationContext.Provider
      value={{
        ...ONBOARDING_CONTEXT,
        hasBankSetup: true,
        paymentContinued: true,
        canSubmitApplication: true,
        actions: { ...ONBOARDING_CONTEXT.actions, submitApplication: submit },
        ...overrides,
      }}
    >
      <TermsAndConditions />
    </ApplicationContext.Provider>
  );
}

describe('TermsAndConditions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submit.mockImplementation(ONBOARDING_CONTEXT.actions.submitApplication);
  });

  it('renders the agreement without a backward navigation control', () => {
    renderWithContext();
    expect(
      screen.getByText('Electronic Delivery of Documents')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agree and submit' })
    ).toBeEnabled();
    expect(
      screen.queryByRole('button', { name: /back|add your bank/i })
    ).not.toBeInTheDocument();
  });

  it('does not show the agreement before bank details are saved', () => {
    renderWithContext({ hasBankSetup: false, paymentContinued: false });
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Complete the payment step'
    );
    expect(
      screen.queryByRole('button', { name: 'Agree and submit' })
    ).not.toBeInTheDocument();
  });

  it('does not treat saved bank details as payment Continue', () => {
    renderWithContext({ paymentContinued: false });
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Complete the payment step'
    );
    expect(
      screen.queryByRole('button', { name: 'Agree and submit' })
    ).not.toBeInTheDocument();
  });

  it('offers refresh rather than backtracking if saved bank readiness regresses', async () => {
    const user = userEvent.setup();
    renderWithContext({ hasBankSetup: false });
    expect(screen.getByRole('alert')).toHaveTextContent(
      'We could not confirm your saved bank information.'
    );
    expect(
      screen.queryByRole('button', { name: /back|add your bank/i })
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Refresh application status' })
    );
    expect(refresh).toHaveBeenCalledOnce();
  });

  it('disables submission for read-only users', () => {
    renderWithContext({ canEditFarm: false });
    expect(screen.getByText(/your account is read only/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agree and submit' })
    ).toBeDisabled();
  });

  it('allows refreshing stale server readiness without navigating backwards', async () => {
    const user = userEvent.setup();
    renderWithContext({ canSubmitApplication: false });
    expect(
      screen.getByRole('button', { name: 'Agree and submit' })
    ).toBeDisabled();
    await user.click(
      screen.getByRole('button', { name: 'Refresh application status' })
    );
    expect(refresh).toHaveBeenCalledOnce();
    expect(push).not.toHaveBeenCalled();
  });

  it('finishes onboarding after the agreement action succeeds', async () => {
    const user = userEvent.setup();
    renderWithContext();
    await user.click(screen.getByRole('button', { name: 'Agree and submit' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(submit).toHaveBeenCalledOnce();
  });

  it('keeps the user on terms when the server rejects submission', async () => {
    const user = userEvent.setup();
    submit.mockRejectedValueOnce(new Error('Unable to accept terms.'));
    renderWithContext();
    await user.click(screen.getByRole('button', { name: 'Agree and submit' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'There was an error submitting your application.'
    );
    expect(push).not.toHaveBeenCalled();
  });
});
