// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getOnboardingAccount } from '@/app/(onboarding)/apply/db';
import { deriveOnboardingStep } from '@/app/(onboarding)/apply/onboarding-steps';
import type { OnboardingStep } from '@/app/(onboarding)/apply/types';
import { assertCanEditFarm } from '@/lib/utils/farm-rbac';

/** Checks applicant identity and persisted progress before a step changes server data. */
export async function requireOnboardingStep(
  step: Exclude<OnboardingStep, 'password'>
) {
  const account = await getOnboardingAccount();
  assertCanEditFarm(account.currentUser, `onboarding-${step}`);
  if (!account.isApplicant || deriveOnboardingStep(account.state) !== step) {
    throw new Error(
      'This onboarding step is no longer available. Refresh to continue.'
    );
  }
  return account;
}
