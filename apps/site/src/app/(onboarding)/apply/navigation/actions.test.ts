// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ONBOARDING_DATA } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import { getOnboardingAccount } from '@/app/(onboarding)/apply/db';
import {
  completePaymentStep,
  completeTeamStep,
  goBackToTeam,
} from '@/app/(onboarding)/apply/navigation/actions';
import { deriveOnboardingStep } from '@/app/(onboarding)/apply/onboarding-steps';
import { createClient } from '@/lib/supabase/server';

const { updateUser } = vi.hoisted(() => ({
  updateUser: vi.fn<
    (attributes: {
      data: {
        onboarding_team_step_done?: boolean;
        onboarding_payment_continued?: boolean;
      };
    }) => Promise<{ error: Error | null }>
  >(),
}));

vi.mock('@/app/(onboarding)/apply/db', () => ({
  getOnboardingAccount: vi.fn(),
}));
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({ auth: { updateUser } })),
}));
vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn() },
  default: { error: vi.fn(), warn: vi.fn() },
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
  updateUser.mockImplementation(async ({ data }) => {
    if (data.onboarding_team_step_done !== undefined)
      account.state.teamStepDone = data.onboarding_team_step_done;
    if (data.onboarding_payment_continued !== undefined)
      account.state.paymentContinued = data.onboarding_payment_continued;
    return { error: null };
  });
});

describe('onboarding navigation actions', () => {
  it('persists an optional team step and resumes at payment without inviting anyone', async () => {
    await expect(completeTeamStep()).resolves.toEqual({});
    expect(updateUser).toHaveBeenCalledWith({
      data: { onboarding_team_step_done: true },
    });
    expect(deriveOnboardingStep(account.state)).toBe('payment');
  });

  it.each([false, true])(
    'persists Back to Add people when bank readiness is %s',
    async (bankReady) => {
      account.state.teamStepDone = true;
      account.state.bankReady = bankReady;
      await expect(goBackToTeam()).resolves.toEqual({});
      expect(updateUser).toHaveBeenCalledWith({
        data: { onboarding_team_step_done: false },
      });
      expect(deriveOnboardingStep(account.state)).toBe('team');
      await completeTeamStep();
      expect(deriveOnboardingStep(account.state)).toBe('payment');
      expect(account.state.passwordSet).toBe(true);
    }
  );

  it('does not allow payment Continue until bank information is ready', async () => {
    account.state.teamStepDone = true;
    await expect(completePaymentStep()).rejects.toThrow(
      'Add your bank information'
    );
    expect(createClient).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
    expect(deriveOnboardingStep(account.state)).toBe('payment');
  });

  it('locks earlier steps only after the saved bank information is explicitly continued', async () => {
    account.state.teamStepDone = true;
    account.state.bankReady = true;
    expect(deriveOnboardingStep(account.state)).toBe('payment');
    await expect(completePaymentStep()).resolves.toEqual({});
    expect(updateUser).toHaveBeenCalledExactlyOnceWith({
      data: { onboarding_payment_continued: true },
    });
    expect(deriveOnboardingStep(account.state)).toBe('terms');
    await expect(goBackToTeam()).rejects.toThrow(
      'This onboarding step is no longer available'
    );
    await expect(completeTeamStep()).rejects.toThrow(
      'This onboarding step is no longer available'
    );
    expect(updateUser).toHaveBeenCalledOnce();
  });

  it('does not unlock Add people if bank readiness is later lost', async () => {
    account.state.paymentContinued = true;
    await expect(goBackToTeam()).rejects.toThrow(
      'This onboarding step is no longer available'
    );
    expect(updateUser).not.toHaveBeenCalled();
    expect(deriveOnboardingStep(account.state)).toBe('terms');
  });

  it.each([
    {
      name: 'team Continue',
      action: completeTeamStep,
      teamStepDone: false,
      expectedStep: 'team',
    },
    {
      name: 'Back to Add people',
      action: goBackToTeam,
      teamStepDone: true,
      expectedStep: 'payment',
    },
    {
      name: 'payment Continue',
      action: completePaymentStep,
      teamStepDone: true,
      expectedStep: 'payment',
    },
  ])(
    'does not change progress when $name fails to save',
    async ({ action, teamStepDone, expectedStep }) => {
      account.state.teamStepDone = teamStepDone;
      account.state.bankReady = true;
      const previousState = { ...account.state };
      updateUser.mockResolvedValueOnce({
        error: new Error('Metadata unavailable'),
      });
      await expect(action()).rejects.toThrow('Unable to save your progress');
      expect(account.state).toEqual(previousState);
      expect(deriveOnboardingStep(account.state)).toBe(expectedStep);
    }
  );

  it.each([
    { name: 'team Continue', action: completeTeamStep },
    { name: 'Back to Add people', action: goBackToTeam },
    { name: 'payment Continue', action: completePaymentStep },
  ])(
    'rejects $name after terms completion without writing metadata',
    async ({ action }) => {
      account.state.termsAccepted = true;
      await expect(action()).rejects.toThrow(
        'This onboarding step is no longer available'
      );
      expect(updateUser).not.toHaveBeenCalled();
    }
  );
});
