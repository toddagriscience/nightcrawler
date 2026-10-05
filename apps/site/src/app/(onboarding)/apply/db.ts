// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  farm,
  farmSubscription,
  formSubmission,
  user,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { and, eq, inArray, isNull, ne } from 'drizzle-orm';
import { extractApplicantPrefillFromAnswers } from '@nightcrawler/db/utils/extract-applicant-prefill';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasCompletedPlatformOnboarding } from '@/lib/utils/platform-onboarding';
import { logger } from '@/lib/logger';
import { BANK_READY_STATUSES } from '@/app/(onboarding)/apply/onboarding-steps';
import type { OnboardingState } from '@/app/(onboarding)/apply/types';

/**
 * Whether slim onboarding can be submitted (terms accepted).
 *
 * Requires bank information captured on `farmSubscription`. General Business
 * and Farm tabs are no longer part of client onboarding.
 *
 * @param farmId - The applying farm's id
 */
export async function isApplicationReadyForSubmission(
  farmId: number
): Promise<boolean> {
  const [subscription] = await db
    .select({ farmId: farmSubscription.farmId })
    .from(farmSubscription)
    .where(
      and(
        eq(farmSubscription.farmId, farmId),
        inArray(farmSubscription.status, [...BANK_READY_STATUSES])
      )
    )
    .limit(1);

  return Boolean(subscription);
}

/** Loads fresh auth progress and proves applicant identity from the approved submission. */
export async function getOnboardingAccount() {
  const currentUser = await getAuthenticatedInfo();
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  if (
    error ||
    !authData.user ||
    authData.user.email?.toLowerCase() !== currentUser.email.toLowerCase()
  ) {
    throw new Error('Please sign in again to continue account setup.');
  }

  const [applications, subscriptions] = await Promise.all([
    db
      .select({
        id: formSubmission.id,
        answers: formSubmission.answers,
        signedUpAt: formSubmission.signedUpAt,
      })
      .from(formSubmission)
      .where(
        and(
          eq(formSubmission.farmId, currentUser.farmId),
          eq(formSubmission.workflowType, 'platform_access'),
          eq(formSubmission.status, 'approved'),
          isNull(formSubmission.deletedAt)
        )
      ),
    db
      .select()
      .from(farmSubscription)
      .where(eq(farmSubscription.farmId, currentUser.farmId))
      .limit(1),
  ]);
  const application = applications.find(
    (candidate) =>
      Boolean(candidate.signedUpAt) &&
      extractApplicantPrefillFromAnswers(
        candidate.answers
      ).email?.toLowerCase() === currentUser.email.toLowerCase()
  );
  const metadata: Record<string, unknown> = authData.user.user_metadata;
  const subscription = subscriptions.at(0) ?? null;
  const isApplicant = currentUser.role === 'Admin' && Boolean(application);
  const bankReady = BANK_READY_STATUSES.some(
    (status) => status === subscription?.status
  );
  const state: OnboardingState = {
    // Existing applicants signed up before progress markers were introduced.
    passwordSet:
      metadata.onboarding_password_set === true ||
      (metadata.onboarding_password_set === undefined && Boolean(application)),
    teamStepDone: metadata.onboarding_team_step_done === true,
    bankReady,
    paymentContinued: metadata.onboarding_payment_continued === true,
    termsAccepted: await hasCompletedPlatformOnboarding(
      currentUser.id,
      currentUser.approved
    ),
  };
  return { currentUser, subscription, isApplicant, state };
}

/** Loads the farm label and invitation list without exposing applicant tokens. */
export async function getOnboardingTeam(
  currentUser: Awaited<ReturnType<typeof getAuthenticatedInfo>>
) {
  const [farms, allUsers] = await Promise.all([
    db
      .select({ informalName: farm.informalName })
      .from(farm)
      .where(eq(farm.id, currentUser.farmId))
      .limit(1),
    db
      .select()
      .from(user)
      .where(
        and(eq(user.farmId, currentUser.farmId), ne(user.id, currentUser.id))
      ),
  ]);
  const supabase = await createClient();
  const invitedUserVerificationStatus = await Promise.all(
    allUsers.map(async (teammate) => {
      const { data, error } = await supabase.rpc(
        'get_email_verification_from_email',
        { email_address: teammate.email }
      );
      if (error)
        logger.error('Unable to read invitation verification status', error);
      return { email: teammate.email, verified: !error && Boolean(data) };
    })
  );
  return {
    farmInfo: {
      farmId: currentUser.farmId,
      informalName: farms[0]?.informalName ?? undefined,
    },
    allUsers,
    invitedUserVerificationStatus,
  };
}
