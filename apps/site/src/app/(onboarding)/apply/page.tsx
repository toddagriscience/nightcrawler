// Copyright © Todd Agriscience, Inc. All rights reserved.

import { redirect } from 'next/navigation';
import { getUserEmail } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase/server';
import {
  isFormSubmissionSignupAlreadyCompleted,
  isFormSubmissionSignupLinkConsumed,
  resolveSignupContext,
} from '@nightcrawler/db/queries';
import ApprovedApplicantGate from '@/app/(unauthenticated)/signup/components/approved-applicant-gate';
import { signUp } from '@/app/(unauthenticated)/signup/actions';
import OnboardingFlow from '@/app/(onboarding)/apply/components/onboarding-flow';
import {
  getOnboardingAccount,
  getOnboardingTeam,
} from '@/app/(onboarding)/apply/db';
import { deriveOnboardingStep } from '@/app/(onboarding)/apply/onboarding-steps';
import {
  completeTeamStep,
  completePaymentStep,
  goBackToTeam,
} from '@/app/(onboarding)/apply/navigation/actions';
import {
  createAchSetupIntent,
  recordAchSetupComplete,
  inviteUserToFarm,
  submitApplication,
} from '@/app/(onboarding)/apply/actions';
import {
  resendVerificationEmail,
  uninviteUser,
} from '@/app/(onboarding)/apply/components/colleagues/actions';
import type { OnboardingActions } from '@/app/(onboarding)/apply/types';

const actions: OnboardingActions = {
  signUp,
  completeTeamStep,
  completePaymentStep,
  goBackToTeam,
  createAchSetupIntent,
  recordAchSetupComplete,
  inviteUserToFarm,
  submitApplication,
  resendVerificationEmail,
  uninviteUser,
};

/** Hosts password creation and authenticated account setup at one stable URL. */
export default async function Apply({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const applicationId =
    typeof params.application_id === 'string' ? params.application_id : '';
  const token = typeof params.token === 'string' ? params.token : '';
  const sessionEmail = await getUserEmail();

  // A token grants only the password form; every action validates it again.
  if (applicationId || token) {
    const parsedId = /^\d+$/.test(applicationId) ? Number(applicationId) : 0;
    if (!Number.isSafeInteger(parsedId) || parsedId <= 0 || !token) {
      return <ApprovedApplicantGate reason="invalid-link" email="" />;
    }
    const applicant = await resolveSignupContext(parsedId, token);
    if (applicant) {
      if (
        sessionEmail &&
        sessionEmail.toLowerCase() !== applicant.email.toLowerCase()
      ) {
        return (
          <ApprovedApplicantGate
            reason="email-mismatch"
            email={applicant.email}
            sessionEmail={sessionEmail}
          />
        );
      }
      let passwordSet = false;
      if (sessionEmail) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error)
          throw new Error(
            'Unable to load your account progress. Please try again.'
          );
        const metadata: Record<string, unknown> =
          data.user?.user_metadata ?? {};
        passwordSet =
          data.user?.email?.toLowerCase() === applicant.email.toLowerCase() &&
          metadata.onboarding_applicant === true &&
          metadata.onboarding_password_set === true &&
          metadata.onboarding_application_id === applicant.applicationId;
      }
      return (
        <OnboardingFlow
          applicant={{
            applicationId: applicant.applicationId,
            token: applicant.token,
            email: applicant.email,
            passwordSet,
          }}
          actions={actions}
        />
      );
    }
    if (
      !sessionEmail &&
      (await isFormSubmissionSignupLinkConsumed(parsedId, token))
    ) {
      redirect('/login');
    }
    if (
      !sessionEmail ||
      !(await isFormSubmissionSignupAlreadyCompleted(
        parsedId,
        token,
        sessionEmail
      ))
    ) {
      return <ApprovedApplicantGate reason="invalid-link" email="" />;
    }
  }

  if (!sessionEmail) redirect('/login');
  const account = await getOnboardingAccount();
  if (account.state.termsAccepted) redirect('/');

  if (!account.isApplicant) {
    // Invited viewers keep their existing agreement flow; they never collect farm payment.
    if (account.currentUser.role === 'Viewer') redirect('/account/agreement');
    return (
      <main className="mx-auto mt-16 max-w-[550px]">
        <h1 className="text-2xl">Account setup</h1>
        <p className="mt-4">
          Please use the onboarding link from your approval email to finish
          setting up your account.
        </p>
      </main>
    );
  }

  const initialStep = deriveOnboardingStep(account.state);
  if (initialStep === null) redirect('/');
  if (initialStep === 'password') {
    return (
      <main className="mx-auto mt-16 max-w-[550px]">
        <h1 className="text-2xl">Finish creating your password</h1>
        <p className="mt-4">
          Open the onboarding link from your approval email to continue.
        </p>
      </main>
    );
  }
  const team = await getOnboardingTeam(account.currentUser);
  const returnedSetupIntentId =
    typeof params.setup_intent === 'string' &&
    /^seti_[A-Za-z0-9]+$/.test(params.setup_intent)
      ? params.setup_intent
      : undefined;
  return (
    <OnboardingFlow
      actions={actions}
      data={{
        ...team,
        currentUser: account.currentUser,
        farmSubscription: account.subscription,
        initialStep,
        hasBankSetup: account.state.bankReady,
        paymentContinued: account.state.paymentContinued,
        canSubmitApplication:
          account.state.bankReady && account.state.paymentContinued,
        returnedSetupIntentId,
      }}
    />
  );
}
