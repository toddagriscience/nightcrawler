// Copyright © Todd Agriscience, Inc. All rights reserved.

export const dynamic = 'force-dynamic';

import { getUserEmail } from '@/lib/auth-server';
import {
  isFormSubmissionSignupAlreadyCompleted,
  resolveSignupContext,
} from '@nightcrawler/db/queries';
import { redirect } from 'next/navigation';
import ApprovedApplicantGate from './components/approved-applicant-gate';
import SignupForm from './components/signup-form';

/** Search params accepted by the signup page. */
type SignupPageSearchParams = Record<string, string | string[] | undefined>;

/**
 * Reads a single string value from Next.js search params.
 *
 * @param params - Page search params
 * @param key - Query key to read
 */
function readSearchParam(params: SignupPageSearchParams, key: string): string {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

/** Password step for approved platform-access applicants.
 *
 * @param props - Page props including locale and search params
 */
export default async function Join({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SignupPageSearchParams>;
}) {
  const { locale } = await params;
  const contactPath = `/${locale}/contact`;
  const resolvedSearchParams = await searchParams;
  const applicationId = readSearchParam(resolvedSearchParams, 'application_id');
  const token = readSearchParam(resolvedSearchParams, 'token');

  if (!applicationId || !token) {
    redirect(contactPath);
  }

  const parsedApplicationId = Number.parseInt(applicationId, 10);

  if (!Number.isFinite(parsedApplicationId)) {
    return (
      <ApprovedApplicantGate reason="invalid-link" token={token} email="" />
    );
  }

  const signupContext = await resolveSignupContext(parsedApplicationId, token);

  if (!signupContext) {
    const legacyEmail = readSearchParam(resolvedSearchParams, 'email');
    const alreadyCompleted = legacyEmail
      ? await isFormSubmissionSignupAlreadyCompleted(
          parsedApplicationId,
          token,
          legacyEmail
        )
      : false;

    if (alreadyCompleted) {
      redirect('/apply');
    }

    return (
      <ApprovedApplicantGate
        email={legacyEmail}
        reason="invalid-link"
        applicationId={parsedApplicationId}
        token={token}
      />
    );
  }

  const sessionEmail = await getUserEmail();

  if (
    sessionEmail &&
    sessionEmail.toLowerCase() !== signupContext.email.toLowerCase()
  ) {
    return (
      <ApprovedApplicantGate
        email={signupContext.email}
        reason="email-mismatch"
        sessionEmail={sessionEmail}
        applicationId={parsedApplicationId}
        token={token}
      />
    );
  }

  return (
    <SignupForm
      isApprovedApplicantSignup
      prefill={{
        firstName: signupContext.prefill.firstName ?? '',
        lastName: signupContext.prefill.lastName ?? '',
        farmName: signupContext.prefill.farmName ?? '',
        email: signupContext.email,
        phone: signupContext.prefill.phone ?? '',
        applicationId: String(signupContext.applicationId),
        token: signupContext.token,
      }}
    />
  );
}
