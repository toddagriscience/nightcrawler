// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  OnboardingState,
  OnboardingStep,
} from '@/app/(onboarding)/apply/types';

/** Ordered, non-interactive milestones displayed throughout account setup. */
export const ONBOARDING_STEPS = [
  { id: 'password', label: 'Set password' },
  { id: 'team', label: 'Add people' },
  { id: 'payment', label: 'Payment' },
  { id: 'terms', label: 'Accept terms' },
] as const satisfies ReadonlyArray<{ id: OnboardingStep; label: string }>;

/** Subscription states backed by saved bank information. */
export const BANK_READY_STATUSES = [
  'bank_setup_complete',
  'active',
  'trialing',
] as const;

/** Resolves the current step, keeping bank setup distinct from payment Continue. */
export function deriveOnboardingStep(
  state: OnboardingState
): OnboardingStep | null {
  if (!state.passwordSet) return 'password';
  if (state.termsAccepted) return null;
  if (state.paymentContinued) return 'terms';
  if (!state.teamStepDone) return 'team';
  return 'payment';
}
