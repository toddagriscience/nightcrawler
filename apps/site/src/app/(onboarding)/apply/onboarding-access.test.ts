// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ONBOARDING_DATA } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import { getOnboardingAccount } from '@/app/(onboarding)/apply/db';
import { requireOnboardingStep } from '@/app/(onboarding)/apply/onboarding-access';
import type { OnboardingStep } from '@/app/(onboarding)/apply/types';

vi.mock('@/app/(onboarding)/apply/db', () => ({
  getOnboardingAccount: vi.fn(),
}));

let account: Awaited<ReturnType<typeof getOnboardingAccount>>;

beforeEach(() => {
  vi.clearAllMocks();
  account = {
    currentUser: { ...ONBOARDING_DATA.currentUser },
    subscription: null,
    isApplicant: true,
    state: {
      passwordSet: true,
      teamStepDone: false,
      bankReady: false,
      paymentContinued: false,
      termsAccepted: false,
    },
  };
  vi.mocked(getOnboardingAccount).mockResolvedValue(account);
});

describe('requireOnboardingStep', () => {
  it('returns the freshly loaded applicant at the current step', async () => {
    await expect(requireOnboardingStep('team')).resolves.toBe(account);
    expect(getOnboardingAccount).toHaveBeenCalledOnce();
  });

  it('rejects viewers even when applicant and progress markers are present', async () => {
    account.currentUser.role = 'Viewer';
    await expect(requireOnboardingStep('team')).rejects.toThrow(
      'You do not have permission'
    );
  });

  it('rejects an invited administrator who is not the applicant', async () => {
    account.isApplicant = false;
    await expect(requireOnboardingStep('team')).rejects.toThrow(
      'This onboarding step is no longer available'
    );
  });

  it.each<Exclude<OnboardingStep, 'password'>>(['team', 'payment', 'terms'])(
    'rejects %s before password setup completes',
    async (step) => {
      account.state.passwordSet = false;
      await expect(requireOnboardingStep(step)).rejects.toThrow(
        'This onboarding step is no longer available'
      );
    }
  );

  it.each<Exclude<OnboardingStep, 'password'>>(['payment', 'terms'])(
    'rejects skipping invitations directly to %s',
    async (step) => {
      await expect(requireOnboardingStep(step)).rejects.toThrow(
        'This onboarding step is no longer available'
      );
    }
  );

  it('rejects terms while saved bank information is still awaiting Continue', async () => {
    account.state.teamStepDone = true;
    account.state.bankReady = true;
    await expect(requireOnboardingStep('payment')).resolves.toBe(account);
    await expect(requireOnboardingStep('terms')).rejects.toThrow(
      'This onboarding step is no longer available'
    );
  });

  it('keeps earlier steps unavailable when bank readiness is lost after Continue', async () => {
    account.state.paymentContinued = true;
    await expect(requireOnboardingStep('team')).rejects.toThrow(
      'This onboarding step is no longer available'
    );
    await expect(requireOnboardingStep('payment')).rejects.toThrow(
      'This onboarding step is no longer available'
    );
    await expect(requireOnboardingStep('terms')).resolves.toBe(account);
  });

  it.each<Exclude<OnboardingStep, 'password'>>(['team', 'payment', 'terms'])(
    'rejects %s after terms completion',
    async (step) => {
      account.state.termsAccepted = true;
      await expect(requireOnboardingStep(step)).rejects.toThrow(
        'This onboarding step is no longer available'
      );
    }
  );

  it('propagates authentication failures without granting step access', async () => {
    vi.mocked(getOnboardingAccount).mockRejectedValue(
      new Error('Please sign in again')
    );
    await expect(requireOnboardingStep('team')).rejects.toThrow(
      'Please sign in again'
    );
  });
});
