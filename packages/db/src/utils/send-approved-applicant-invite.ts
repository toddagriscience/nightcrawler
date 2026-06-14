// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createClient } from '@supabase/supabase-js';

/** Result of sending an approved-applicant onboarding email. */
export interface SendApprovedApplicantInviteResult {
  /** Whether Supabase accepted the email send request */
  sent: boolean;
  /** Delivery method used when sent */
  method?: 'onboarding-link';
  /** Error message when sending failed */
  error?: string;
}

/**
 * Returns a configured Supabase admin client for auth email actions.
 *
 * @param projectId - Supabase project id
 * @param secretKey - Supabase service role key
 */
function getSupabaseAdminClient(projectId: string, secretKey: string) {
  return createClient(`https://${projectId}.supabase.co`, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Sends a single onboarding email with a tokenized signup link (no `/auth/confirm` step).
 *
 * @param input - Applicant email and full onboarding URL
 */
export async function sendApprovedApplicantInvite(input: {
  email: string;
  firstName?: string;
  onboardingUrl: string;
  projectId: string;
  secretKey: string;
}): Promise<SendApprovedApplicantInviteResult> {
  const redirectTo = input.onboardingUrl;
  const displayName =
    input.firstName?.trim() || input.email.split('@')[0] || 'Applicant';

  const supabaseAdmin = getSupabaseAdminClient(
    input.projectId,
    input.secretKey
  );

  const sendMagicLink = (shouldCreateUser: boolean) =>
    supabaseAdmin.auth.signInWithOtp({
      email: input.email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser,
        data: {
          first_name: displayName,
          name: displayName,
        },
      },
    });

  const initialResult = await sendMagicLink(true);

  if (!initialResult.error) {
    return { sent: true, method: 'onboarding-link' };
  }

  const initialMessage = initialResult.error.message.toLowerCase();

  if (
    initialMessage.includes('already') ||
    initialMessage.includes('registered') ||
    initialMessage.includes('exists')
  ) {
    const retryResult = await sendMagicLink(false);

    if (!retryResult.error) {
      return { sent: true, method: 'onboarding-link' };
    }

    return {
      sent: false,
      error: `${retryResult.error.message} Also add ${new URL(redirectTo).origin}/signup** to Supabase → Authentication → URL Configuration → Redirect URLs. See docs/supabase-auth-emails.md.`,
    };
  }

  const redirectOrigin = new URL(redirectTo).origin;
  const combinedMessage = initialMessage.includes('redirect')
    ? initialResult.error.message
    : `${initialResult.error.message} If this mentions redirect URLs, add ${redirectOrigin}/signup** in Supabase → Authentication → URL Configuration. See docs/supabase-auth-emails.md.`;

  return { sent: false, error: combinedMessage };
}
