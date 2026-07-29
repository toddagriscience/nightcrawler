// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Environment configuration
 * @returns {const} - The environment configuration
 */
export const env = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Base URL for canonical links and metadata
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'toddagriscience.com'}`),
} as const;

/**
 * Normalizes a host or URL into an absolute origin: adds `https://` when the
 * value is a bare host (Vercel exposes its URLs without a scheme) and strips
 * any trailing slashes so callers can safely append a path.
 *
 * @param {string} value - A bare host (`example.vercel.app`) or a full URL
 * @returns {string} - An absolute origin with no trailing slash
 */
function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Resolves the origin Supabase should send users back to after an auth email
 * (sign-up confirmation, invite, approved-applicant onboarding).
 *
 * Vercel gives every preview deployment its own hostname, so relying only on
 * `NEXT_PUBLIC_BASE_URL` sends anyone testing a preview deployment to
 * production. On preview deployments this prefers `VERCEL_BRANCH_URL` (stable
 * across redeploys of the same branch, so a single Supabase redirect entry
 * covers it) and falls back to the per-deployment `VERCEL_URL`. Production and
 * local development keep resolving to `NEXT_PUBLIC_BASE_URL` exactly as before.
 *
 * Any origin returned here must be allowed under Supabase's
 * Authentication → URL Configuration → Redirect URLs.
 *
 * @returns {string} - An absolute origin with no trailing slash, e.g. `https://toddagriscience.com`
 */
export function getAuthRedirectBaseUrl(): string {
  const vercelEnv =
    process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV;

  if (vercelEnv === 'preview') {
    const previewHost =
      process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ||
      process.env.VERCEL_BRANCH_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      process.env.VERCEL_URL;

    if (previewHost) {
      return normalizeOrigin(previewHost);
    }
  }

  return normalizeOrigin(
    process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ||
      'https://toddagriscience.com'
  );
}
