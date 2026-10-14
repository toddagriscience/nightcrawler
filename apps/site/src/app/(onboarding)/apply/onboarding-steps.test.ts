// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { deriveOnboardingStep } from '@/app/(onboarding)/apply/onboarding-steps';
import type {
  OnboardingState,
  OnboardingStep,
} from '@/app/(onboarding)/apply/types';

const initialState: OnboardingState = {
  passwordSet: false,
  teamStepDone: false,
  bankReady: false,
  paymentContinued: false,
  termsAccepted: false,
};

describe('deriveOnboardingStep', () => {
  it.each<{
    description: string;
    state: Partial<OnboardingState>;
    expected: OnboardingStep | null;
  }>([
    { description: 'starts with password', state: {}, expected: 'password' },
    {
      description: 'requires password even if other markers exist',
      state: {
        teamStepDone: true,
        bankReady: true,
        paymentContinued: true,
        termsAccepted: true,
      },
      expected: 'password',
    },
    {
      description: 'opens invitations after password',
      state: { passwordSet: true },
      expected: 'team',
    },
    {
      description: 'allows continuing without any invitation',
      state: { passwordSet: true, teamStepDone: true },
      expected: 'payment',
    },
    {
      description: 'does not skip invitations when a bank is saved',
      state: { passwordSet: true, bankReady: true },
      expected: 'team',
    },
    {
      description: 'waits for explicit Continue after bank setup',
      state: { passwordSet: true, teamStepDone: true, bankReady: true },
      expected: 'payment',
    },
    {
      description: 'opens terms after bank setup and Continue',
      state: {
        passwordSet: true,
        teamStepDone: true,
        bankReady: true,
        paymentContinued: true,
      },
      expected: 'terms',
    },
    {
      description: 'keeps earlier steps locked despite a stale team marker',
      state: { passwordSet: true, bankReady: true, paymentContinued: true },
      expected: 'terms',
    },
    {
      description:
        'keeps earlier steps locked if bank readiness is lost after Continue',
      state: { passwordSet: true, paymentContinued: true },
      expected: 'terms',
    },
    {
      description: 'finishes after terms are accepted',
      state: { passwordSet: true, termsAccepted: true },
      expected: null,
    },
  ])('$description', ({ state, expected }) => {
    expect(deriveOnboardingStep({ ...initialState, ...state })).toBe(expected);
  });

  it('never returns a password-complete account to password for any later marker state', () => {
    for (const teamStepDone of [false, true]) {
      for (const bankReady of [false, true]) {
        for (const paymentContinued of [false, true]) {
          for (const termsAccepted of [false, true]) {
            expect(
              deriveOnboardingStep({
                passwordSet: true,
                teamStepDone,
                bankReady,
                paymentContinued,
                termsAccepted,
              })
            ).not.toBe('password');
          }
        }
      }
    }
  });
});
