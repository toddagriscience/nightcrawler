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
  const firstName = readSearchParam(resolvedSearchParams, 'first_name');
  const lastName = readSearchParam(resolvedSearchParams, 'last_name');
  const farmName = readSearchParam(resolvedSearchParams, 'farm_name');
  const email = readSearchParam(resolvedSearchParams, 'email');
  const phone = normalizePhoneForUrl(
    readSearchParam(resolvedSearchParams, 'phone')
  );
  const applicationId = readSearchParam(resolvedSearchParams, 'application_id');
  const token = readSearchParam(resolvedSearchParams, 'token');

  if (!applicationId || !token) {
    redirect(contactPath);
  }

  if (!firstName || !lastName || !farmName || !email || !phone) {
    redirect(contactPath);
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
