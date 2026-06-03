// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Builds the `emailRedirectTo` URL for approved-applicant magic-link emails.
 * Uses flat query params so Supabase email links do not nest `?` inside `next`.
 *
 * @param baseUrl - Site origin without trailing slash
 * @param applicationId - Platform access application id
 * @param signupToken - Single-use signup token issued on approval
 */
export function buildApprovedApplicantAuthConfirmUrl(
  baseUrl: string,
  applicationId: number,
  signupToken: string
): string {
  const origin = baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({
    application_id: String(applicationId),
    signup_token: signupToken,
  });

  return `${origin}/auth/confirm?${params.toString()}`;
}
