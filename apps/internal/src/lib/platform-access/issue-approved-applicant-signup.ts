// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '@nightcrawler/db';
import { platformAccessApplication } from '@nightcrawler/db/schema';
import {
  extractApplicantPrefillFromAnswers,
  getMissingApplicantEmailMessage,
} from '@nightcrawler/db/utils/extract-applicant-prefill';
import {
  buildIncomingSignupPath,
  buildIncomingSignupUrl,
} from '@/lib/platform-access/build-incoming-signup-url';
import {
  sendApprovedApplicantInvite,
  type SendApprovedApplicantInviteResult,
} from '@/lib/platform-access/send-approved-applicant-invite';
import { eq } from 'drizzle-orm';
import logger from '@/lib/logger';

/** Fourteen days in milliseconds for signup token expiry. */
const SIGNUP_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 14;

/** Base URL for generated signup links. */
function getSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ??
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

/** Result of issuing a fresh signup token and optional invite email. */
export interface IssueApprovedApplicantSignupResult {
  application: typeof platformAccessApplication.$inferSelect | null;
  signupUrl: string | null;
  emailSent: boolean;
  emailError?: string;
  emailMethod?: SendApprovedApplicantInviteResult['method'];
}

/**
 * Rotates the signup token, sends a fresh auth email, and returns the fallback link.
 *
 * @param id - Platform access application id
 */
export async function issueApprovedApplicantSignupAccess(
  id: number
): Promise<IssueApprovedApplicantSignupResult> {
  const [existing] = await db
    .select()
    .from(platformAccessApplication)
    .where(eq(platformAccessApplication.id, id))
    .limit(1);

  if (!existing) {
    return {
      application: null,
      signupUrl: null,
      emailSent: false,
      emailError: 'Application not found.',
    };
  }

  if (existing.status !== 'approved') {
    return {
      application: existing,
      signupUrl: null,
      emailSent: false,
      emailError: 'Application must be approved before sending a signup email.',
    };
  }

  if (existing.signedUpAt) {
    return {
      application: existing,
      signupUrl: null,
      emailSent: false,
      emailError: 'Applicant has already completed signup.',
    };
  }

  const signupToken = crypto.randomUUID();
  const signupTokenExpiresAt = new Date(Date.now() + SIGNUP_TOKEN_TTL_MS);

  const [application] = await db
    .update(platformAccessApplication)
    .set({
      signupToken,
      signupTokenExpiresAt,
    })
    .where(eq(platformAccessApplication.id, id))
    .returning();

  if (!application) {
    return {
      application: null,
      signupUrl: null,
      emailSent: false,
      emailError: 'Failed to refresh signup token.',
    };
  }

  const answers = (application.answers ?? {}) as Record<string, unknown>;
  const prefill = extractApplicantPrefillFromAnswers(answers);
  const signupUrl = buildIncomingSignupUrl(getSiteBaseUrl(), answers, {
    applicationId: application.id,
    signupToken,
  });

  if (!prefill.email) {
    return {
      application,
      signupUrl,
      emailSent: false,
      emailError: getMissingApplicantEmailMessage(answers),
    };
  }

  if (
    !buildIncomingSignupPath(answers, {
      applicationId: application.id,
      signupToken,
    })
  ) {
    return {
      application,
      signupUrl,
      emailSent: false,
      emailError: 'Could not build signup link from application answers.',
    };
  }

  if (!signupUrl) {
    return {
      application,
      signupUrl: null,
      emailSent: false,
      emailError: 'Could not build onboarding URL from application answers.',
    };
  }

  const inviteResult = await sendApprovedApplicantInvite({
    email: prefill.email,
    firstName: prefill.firstName,
    onboardingUrl: signupUrl,
  });

  if (inviteResult.sent) {
    const [updatedApplication] = await db
      .update(platformAccessApplication)
      .set({ inviteSentAt: new Date() })
      .where(eq(platformAccessApplication.id, id))
      .returning();

    return {
      application: updatedApplication ?? {
        ...application,
        inviteSentAt: new Date(),
      },
      signupUrl,
      emailSent: true,
      emailMethod: inviteResult.method,
    };
  }

  logger.warn('Failed to send approved applicant signup email', {
    applicationId: id,
    email: prefill.email,
    error: inviteResult.error,
  });

  return {
    application,
    signupUrl,
    emailSent: false,
    emailError: inviteResult.error,
  };
}
