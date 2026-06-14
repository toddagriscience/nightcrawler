// Copyright © Todd Agriscience, Inc. All rights reserved.

import { resolveSignupPathForSignupToken } from '@nightcrawler/db/queries';
import { parseSafeRedirectNext } from '@/lib/utils/parse-safe-redirect-next';

/** Resolved redirect target after auth confirm OTP verification. */
export interface AuthConfirmRedirectTarget {
  /** Path only (e.g. `/signup`) */
  pathname: string;
  /** Query string including leading `?`, or empty string */
  search: string;
}

/**
 * Resolves where `/auth/confirm` should send the user after a successful OTP check.
 *
 * @param input - Request search params and site origin
 */
export async function resolveAuthConfirmRedirectTarget(input: {
  applicationIdParam: string | null;
  signupTokenParam: string | null;
  requestedNext: string | null;
  origin: string;
}): Promise<AuthConfirmRedirectTarget> {
  const parsedApplicationId = Number.parseInt(
    input.applicationIdParam ?? '',
    10
  );

  if (Number.isFinite(parsedApplicationId) && input.signupTokenParam?.trim()) {
    const signupPath = await resolveSignupPathForSignupToken(
      parsedApplicationId,
      input.signupTokenParam
    );

    if (signupPath) {
      return parseSafeRedirectNext(signupPath, input.origin);
    }
  }

  const next =
    input.requestedNext &&
    input.requestedNext.startsWith('/') &&
    !input.requestedNext.startsWith('//')
      ? input.requestedNext
      : '/';

  return parseSafeRedirectNext(next, input.origin);
}
