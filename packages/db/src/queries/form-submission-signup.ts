// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '../schema/connection';
import { formSubmission } from '../schema/form-submission';
import {
  ApplicantPrefill,
  buildSignupPath,
  extractApplicantPrefillFromAnswers,
} from '../utils/extract-applicant-prefill';
import { hydrateFarmFromFormSubmission } from '../utils/hydrate-farm-from-form-submission';
import { and, eq, isNull } from 'drizzle-orm';

/** Result of validating an approved platform-access signup token. */
export interface ValidatedFormSubmissionSignup {
  /** Matching submission row id */
  applicationId: number;
  /** Applicant email from stored answers */
  email: string;
}

/** Server-loaded signup context for approved platform-access submissions. */
export interface FormSubmissionSignupContext {
  /** Matching submission row id */
  applicationId: number;
  /** Signup token from the approval link */
  token: string;
  /** Applicant email from stored answers */
  email: string;
  /** Prefill values for account creation */
  prefill: ApplicantPrefill;
}

/**
 * Shared where-clause filters for an active approved platform-access signup link.
 *
 * @param submissionId - Form submission id
 * @param signupToken - Signup token from the approval email
 */
function activePlatformAccessSignupFilters(
  submissionId: number,
  signupToken: string
) {
  return and(
    eq(formSubmission.id, submissionId),
    eq(formSubmission.workflowType, 'platform_access'),
    eq(formSubmission.status, 'approved'),
    eq(formSubmission.signupToken, signupToken),
    isNull(formSubmission.deletedAt)
  );
}

/**
 * Resolves signup context from a submission id and token (no email required in URL).
 *
 * @param submissionId - Form submission id
 * @param signupToken - Signup token from the approval email
 */
export async function resolveSignupContext(
  submissionId: number,
  signupToken: string
): Promise<FormSubmissionSignupContext | null> {
  const normalizedToken = signupToken.trim();

  if (!normalizedToken || !Number.isFinite(submissionId)) {
    return null;
  }

  const [submission] = await db
    .select({
      id: formSubmission.id,
      answers: formSubmission.answers,
      signedUpAt: formSubmission.signedUpAt,
      signupTokenExpiresAt: formSubmission.signupTokenExpiresAt,
    })
    .from(formSubmission)
    .where(activePlatformAccessSignupFilters(submissionId, normalizedToken))
    .limit(1);

  if (!submission || submission.signedUpAt) {
    return null;
  }

  if (
    submission.signupTokenExpiresAt &&
    submission.signupTokenExpiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  const answers = (submission.answers ?? {}) as Record<string, unknown>;
  const prefill = extractApplicantPrefillFromAnswers(answers);
  if (!prefill.email) {
    return null;
  }

  return {
    applicationId: submission.id,
    token: normalizedToken,
    email: prefill.email,
    prefill,
  };
}

/**
 * Resolves a signup path for an approved submission when the signup token matches.
 *
 * @param submissionId - Form submission id
 * @param signupToken - Signup token from the approval email or dashboard link
 */
export async function resolveSignupPathForSignupToken(
  submissionId: number,
  signupToken: string
): Promise<string | null> {
  const context = await resolveSignupContext(submissionId, signupToken);
  if (!context) {
    return null;
  }

  return buildSignupPath({
    applicationId: context.applicationId,
    signupToken: context.token,
  });
}

/** @deprecated Use {@link resolveSignupPathForSignupToken}. */
export const resolveIncomingPathForSignupToken =
  resolveSignupPathForSignupToken;

/**
 * Validates an approved submission signup token for the given email.
 *
 * @param submissionId - Form submission id
 * @param token - Signup token issued on approval
 * @param email - Applicant email completing signup
 */
export async function validateFormSubmissionSignupToken(
  submissionId: number,
  token: string,
  email: string
): Promise<ValidatedFormSubmissionSignup | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  if (!normalizedEmail || !normalizedToken) {
    return null;
  }

  const context = await resolveSignupContext(submissionId, normalizedToken);
  if (!context || context.email.toLowerCase() !== normalizedEmail) {
    return null;
  }

  return {
    applicationId: context.applicationId,
    email: context.email,
  };
}

/** @deprecated Use {@link validateFormSubmissionSignupToken}. */
export const validatePlatformAccessSignupToken =
  validateFormSubmissionSignupToken;

/**
 * Returns whether an approved applicant already finished signup with this link.
 *
 * @param submissionId - Form submission id
 * @param token - Signup token from the onboarding link
 * @param email - Applicant email from the link
 */
export async function isFormSubmissionSignupAlreadyCompleted(
  submissionId: number,
  token: string,
  email: string
): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  if (!normalizedEmail || !normalizedToken) {
    return false;
  }

  const [submission] = await db
    .select({
      signedUpAt: formSubmission.signedUpAt,
      answers: formSubmission.answers,
    })
    .from(formSubmission)
    .where(activePlatformAccessSignupFilters(submissionId, normalizedToken))
    .limit(1);

  if (!submission?.signedUpAt) {
    return false;
  }

  const submissionEmail = extractApplicantPrefillFromAnswers(
    (submission.answers ?? {}) as Record<string, unknown>
  ).email?.toLowerCase();

  return Boolean(submissionEmail && submissionEmail === normalizedEmail);
}

// eslint-disable-next-line no-secrets/no-secrets -- deprecated alias name in JSDoc, not a secret
/** @deprecated Use isFormSubmissionSignupAlreadyCompleted instead. */
export const isPlatformAccessSignupAlreadyCompleted =
  isFormSubmissionSignupAlreadyCompleted;

/**
 * Marks an approved platform-access submission as fully signed up and hydrates farm tables.
 *
 * @param submissionId - Form submission id
 * @param farmId - Farm created during signup
 */
export async function completeFormSubmissionSignup(
  submissionId: number,
  farmId: number
): Promise<void> {
  const [submission] = await db
    .select({
      formSlug: formSubmission.formSlug,
      workflowType: formSubmission.workflowType,
      answers: formSubmission.answers,
    })
    .from(formSubmission)
    .where(
      and(
        eq(formSubmission.id, submissionId),
        eq(formSubmission.workflowType, 'platform_access'),
        eq(formSubmission.status, 'approved'),
        isNull(formSubmission.signedUpAt)
      )
    )
    .limit(1);

  await db
    .update(formSubmission)
    .set({
      signedUpAt: new Date(),
      farmId,
    })
    .where(
      and(
        eq(formSubmission.id, submissionId),
        eq(formSubmission.workflowType, 'platform_access'),
        eq(formSubmission.status, 'approved'),
        isNull(formSubmission.signedUpAt)
      )
    );

  if (!submission) {
    return;
  }

  const answers = (submission.answers ?? {}) as Record<string, unknown>;

  await hydrateFarmFromFormSubmission(farmId, {
    formSlug: submission.formSlug,
    answers,
  });
}

/** @deprecated Use {@link completeFormSubmissionSignup}. */
export const completePlatformAccessSignup = completeFormSubmissionSignup;

/** @deprecated Use {@link ValidatedFormSubmissionSignup}. */
export type ValidatedPlatformAccessSignup = ValidatedFormSubmissionSignup;
