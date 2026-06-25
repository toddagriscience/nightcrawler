// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getUserEmail } from '@/lib/auth-server';
import { formSubmission } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import {
  isFormSubmissionSignupLinkConsumed,
  resolveSignupContext,
} from '@nightcrawler/db/queries';
import { extractApplicantPrefillFromAnswers } from '@nightcrawler/db/utils/extract-applicant-prefill';
import { eq } from 'drizzle-orm';
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

/**
 * Reads the applicant email stored on a submission for resend flows.
 *
 * @param applicationId - Form submission id from the signup link
 */
async function readStoredApplicantEmail(
  applicationId: number
): Promise<string> {
  const [submission] = await db
    .select({ answers: formSubmission.answers })
    .from(formSubmission)
    .where(eq(formSubmission.id, applicationId))
    .limit(1);

  if (!submission) {
    return '';
  }

  return (
    extractApplicantPrefillFromAnswers(
      (submission.answers ?? {}) as Record<string, unknown>
    ).email ?? ''
  );
}

/**
 * Password step for approved platform-access applicants.
 *
 * @param props - Page props including search params from the approval email link
 */
export default async function Join({
  searchParams,
}: {
  searchParams: Promise<SignupPageSearchParams>;
}) {
  const contactPath = '/contact';
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
    const linkConsumed = await isFormSubmissionSignupLinkConsumed(
      parsedApplicationId,
      token
    );

    if (linkConsumed) {
      redirect('/apply');
    }

    const applicantEmail = await readStoredApplicantEmail(parsedApplicationId);

    return (
      <ApprovedApplicantGate
        email={applicantEmail}
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
