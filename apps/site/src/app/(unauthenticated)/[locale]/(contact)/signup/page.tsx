// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getUserEmail } from '@/lib/auth-server';
import {
  isPlatformAccessSignupAlreadyCompleted,
  validatePlatformAccessSignupToken,
} from '@nightcrawler/db/queries';
import { normalizePhoneForUrl } from '@nightcrawler/db/utils/normalize-phone';
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

/** Password step for approved platform-access applicants (`/incoming` → `/en/signup`).
 *
 * @param props - Page props including search params
 */
export default async function Join({
  searchParams,
}: {
  searchParams: Promise<SignupPageSearchParams>;
}) {
  const params = await searchParams;
  const firstName = readSearchParam(params, 'first_name');
  const lastName = readSearchParam(params, 'last_name');
  const farmName = readSearchParam(params, 'farm_name');
  const email = readSearchParam(params, 'email');
  const phone = normalizePhoneForUrl(readSearchParam(params, 'phone'));
  const applicationId = readSearchParam(params, 'application_id');
  const token = readSearchParam(params, 'token');

  if (!applicationId || !token) {
    redirect('/contact');
  }

  if (!firstName || !lastName || !farmName || !email || !phone) {
    redirect('/contact');
  }

  const parsedApplicationId = Number.parseInt(applicationId, 10);

  if (!Number.isFinite(parsedApplicationId)) {
    return (
      <ApprovedApplicantGate
        email={email}
        reason="invalid-link"
        token={token}
      />
    );
  }

  const validatedApplication = await validatePlatformAccessSignupToken(
    parsedApplicationId,
    token,
    email
  );

  if (!validatedApplication) {
    const alreadyCompleted = await isPlatformAccessSignupAlreadyCompleted(
      parsedApplicationId,
      token,
      email
    );

    if (alreadyCompleted) {
      redirect('/apply');
    }

    return (
      <ApprovedApplicantGate
        email={email}
        reason="invalid-link"
        applicationId={parsedApplicationId}
        token={token}
      />
    );
  }

  const sessionEmail = await getUserEmail();

  if (sessionEmail && sessionEmail.toLowerCase() !== email.toLowerCase()) {
    return (
      <ApprovedApplicantGate
        email={email}
        reason="email-mismatch"
        sessionEmail={sessionEmail}
        applicationId={parsedApplicationId}
        token={token}
      />
    );
  }

  return <SignupForm isApprovedApplicantSignup />;
}
