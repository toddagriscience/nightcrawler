// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireOnboardingStep } from '@/app/(onboarding)/apply/onboarding-access';
import { logger } from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';

/** Saves optional team-step completion before displaying payment. */
export async function completeTeamStep(): Promise<ActionResponse> {
  const account = await requireOnboardingStep('team');
  if (account.state.paymentContinued)
    throw new Error('The earlier steps are locked.');
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { onboarding_team_step_done: true },
  });
  if (error) {
    logger.error('Unable to save team-step progress', error);
    throw new Error('Unable to save your progress. Please try again.');
  }
  return {};
}

/** Returns to invitations only while payment Continue has not been recorded. */
export async function goBackToTeam(): Promise<ActionResponse> {
  const account = await requireOnboardingStep('payment');
  if (account.state.paymentContinued)
    throw new Error('The earlier steps are locked.');
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { onboarding_team_step_done: false },
  });
  if (error) {
    logger.error('Unable to return to team invitations', error);
    throw new Error('Unable to save your progress. Please try again.');
  }
  return {};
}

/** Locks earlier steps only after a verified bank account and explicit Continue. */
export async function completePaymentStep(): Promise<ActionResponse> {
  const account = await requireOnboardingStep('payment');
  if (!account.state.bankReady)
    throw new Error('Add your bank information before continuing.');
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { onboarding_payment_continued: true },
  });
  if (error) {
    logger.error('Unable to save payment-step progress', error);
    throw new Error('Unable to save your progress. Please try again.');
  }
  return {};
}
