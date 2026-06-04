// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '../schema/connection';
import { platformAccessApplication } from '../schema/platform-access-application';
import {
  buildIncomingSignupPath,
  extractApplicantPrefillFromAnswers,
} from '../utils/extract-applicant-prefill';
import { and, eq, isNull } from 'drizzle-orm';

/** Result of validating an approved application signup token. */
export interface ValidatedPlatformAccessSignup {
  /** Matching application row id */
  applicationId: number;
  /** Applicant email from stored answers */
  email: string;
}

/**
 * Resolves an `/incoming` path for an approved application when the signup token matches.
 *
 * @param applicationId - Platform access application id
 * @param signupToken - Signup token from the approval email or dashboard link
 */
export async function resolveIncomingPathForSignupToken(
  applicationId: number,
  signupToken: string
): Promise<string | null> {
  const normalizedToken = signupToken.trim();

  if (!normalizedToken || !Number.isFinite(applicationId)) {
    return null;
  }

  const [application] = await db
    .select()
    .from(platformAccessApplication)
    .where(
      and(
        eq(platformAccessApplication.id, applicationId),
        eq(platformAccessApplication.status, 'approved'),
        eq(platformAccessApplication.signupToken, normalizedToken),
        isNull(platformAccessApplication.deletedAt)
      )
    )
    .limit(1);

  if (!application || application.signedUpAt) {
    return null;
  }

  if (
    application.signupTokenExpiresAt &&
    application.signupTokenExpiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  const answers = (application.answers ?? {}) as Record<string, unknown>;

  return buildIncomingSignupPath(answers, {
    applicationId: application.id,
    signupToken: normalizedToken,
  });
}

/**
 * Validates an approved application signup token for the given email.
 *
 * @param applicationId - Platform access application id
 * @param token - Signup token issued on approval
 * @param email - Applicant email completing signup
 */
export async function validatePlatformAccessSignupToken(
  applicationId: number,
  token: string,
  email: string
): Promise<ValidatedPlatformAccessSignup | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  if (!normalizedEmail || !normalizedToken) {
    return null;
  }

  const [application] = await db
    .select()
    .from(platformAccessApplication)
    .where(
      and(
        eq(platformAccessApplication.id, applicationId),
        eq(platformAccessApplication.status, 'approved'),
        eq(platformAccessApplication.signupToken, normalizedToken),
        isNull(platformAccessApplication.deletedAt)
      )
    )
    .limit(1);

  if (!application) {
    return null;
  }

  if (application.signedUpAt) {
    return null;
  }

  if (
    application.signupTokenExpiresAt &&
    application.signupTokenExpiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  const answers = (application.answers ?? {}) as Record<string, unknown>;
  const applicationEmail =
    extractApplicantPrefillFromAnswers(answers).email?.toLowerCase();

  if (!applicationEmail || applicationEmail !== normalizedEmail) {
    return null;
  }

  return {
    applicationId: application.id,
    email: applicationEmail,
  };
}

/**
 * Returns whether an approved applicant already finished signup with this link.
 * Used to send repeat visits to `/apply` instead of showing an expired-link gate.
 *
 * @param applicationId - Platform access application id
 * @param token - Signup token from the onboarding link
 * @param email - Applicant email from the link
 */
export async function isPlatformAccessSignupAlreadyCompleted(
  applicationId: number,
  token: string,
  email: string
): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  if (!normalizedEmail || !normalizedToken) {
    return false;
  }

  const [application] = await db
    .select({
      signedUpAt: platformAccessApplication.signedUpAt,
      answers: platformAccessApplication.answers,
    })
    .from(platformAccessApplication)
    .where(
      and(
        eq(platformAccessApplication.id, applicationId),
        eq(platformAccessApplication.status, 'approved'),
        eq(platformAccessApplication.signupToken, normalizedToken),
        isNull(platformAccessApplication.deletedAt)
      )
    )
    .limit(1);

  if (!application?.signedUpAt) {
    return false;
  }

  const applicationEmail = extractApplicantPrefillFromAnswers(
    (application.answers ?? {}) as Record<string, unknown>
  ).email?.toLowerCase();

  return Boolean(applicationEmail && applicationEmail === normalizedEmail);
}

/**
 * Marks an approved application as fully signed up and links the created farm.
 *
 * @param applicationId - Platform access application id
 * @param farmId - Farm created during signup
 */
export async function completePlatformAccessSignup(
  applicationId: number,
  farmId: number
): Promise<void> {
  await db
    .update(platformAccessApplication)
    .set({
      signedUpAt: new Date(),
      farmId,
    })
    .where(
      and(
        eq(platformAccessApplication.id, applicationId),
        eq(platformAccessApplication.status, 'approved'),
        isNull(platformAccessApplication.signedUpAt)
      )
    );
}
