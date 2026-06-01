// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createClient } from '@supabase/supabase-js';
import logger from '@/lib/logger';

/** Result of sending an approved-applicant auth email. */
export interface SendApprovedApplicantInviteResult {
  /** Whether Supabase accepted the email send request */
  sent: boolean;
  /** Delivery method used when sent */
  method?: 'magiclink';
  /** Error message when sending failed */
  error?: string;
}

/**
 * Builds the post-auth onboarding path for an approved applicant.
 *
 * @param incomingPath - `/incoming` path including query params
 */
function buildAuthConfirmRedirect(incomingPath: string): string {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ??
    'http://localhost:3000'
  ).replace(/\/$/, '');

  const next = incomingPath.startsWith('/') ? incomingPath : `/${incomingPath}`;
  return `${baseUrl}/auth/confirm?next=${encodeURIComponent(next)}`;
}

/**
 * Returns a configured Supabase admin client for auth email actions.
 */
function getSupabaseAdminClient() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !secretKey) {
    return null;
  }

  return createClient(`https://${projectId}.supabase.co`, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Sends a Supabase magic-link email so an approved applicant can begin signup.
 *
 * @param input - Applicant email and onboarding redirect path
 */
export async function sendApprovedApplicantInvite(input: {
  email: string;
  firstName?: string;
  incomingPath: string;
}): Promise<SendApprovedApplicantInviteResult> {
  const supabaseAdmin = getSupabaseAdminClient();

  if (!supabaseAdmin) {
    return {
      sent: false,
      error:
        'Missing SUPABASE_SECRET_KEY in apps/internal/.env.local. Copy the service role key from Supabase → Project Settings → API.',
    };
  }

  const redirectTo = buildAuthConfirmRedirect(input.incomingPath);
  const displayName =
    input.firstName?.trim() || input.email.split('@')[0] || 'Applicant';

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
    return { sent: true, method: 'magiclink' };
  }

  const initialMessage = initialResult.error.message.toLowerCase();

  if (
    initialMessage.includes('already') ||
    initialMessage.includes('registered') ||
    initialMessage.includes('exists')
  ) {
    const retryResult = await sendMagicLink(false);

    if (!retryResult.error) {
      return { sent: true, method: 'magiclink' };
    }

    logger.error('Failed to resend approved applicant magic-link email', {
      email: input.email,
      error: retryResult.error.message,
    });

    return {
      sent: false,
      error: `${retryResult.error.message} Also add ${redirectTo.split('?')[0]} to Supabase → Authentication → URL Configuration → Redirect URLs.`,
    };
  }

  logger.error('Failed to send approved applicant magic-link email', {
    email: input.email,
    error: initialResult.error.message,
  });

  const redirectHint = redirectTo.split('?')[0];
  const combinedMessage = initialMessage.includes('redirect')
    ? initialResult.error.message
    : `${initialResult.error.message} If this mentions redirect URLs, add ${redirectHint} in Supabase → Authentication → URL Configuration.`;

  return { sent: false, error: combinedMessage };
}
