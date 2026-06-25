// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  sendApprovedApplicantInvite as sendApprovedApplicantInviteCore,
  type SendApprovedApplicantInviteResult,
} from '@nightcrawler/db/utils/send-approved-applicant-invite';

export type { SendApprovedApplicantInviteResult };

/**
 * Sends the approved-applicant onboarding email with a tokenized signup link.
 *
 * @param input - Applicant email and full onboarding URL
 */
export async function sendApprovedApplicantInvite(input: {
  email: string;
  firstName?: string;
  onboardingUrl: string;
}): Promise<SendApprovedApplicantInviteResult> {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !secretKey) {
    return {
      sent: false,
      error:
        'Missing SUPABASE_SECRET_KEY in apps/internal/.env.local. Copy the service role key from Supabase → Project Settings → API.',
    };
  }

  return sendApprovedApplicantInviteCore({
    email: input.email,
    firstName: input.firstName,
    onboardingUrl: input.onboardingUrl,
    projectId,
    secretKey,
  });
}
