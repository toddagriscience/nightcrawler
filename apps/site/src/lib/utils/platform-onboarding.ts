// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { redirect } from 'next/navigation';
import { hasAcceptedAccountAgreement } from './account-agreement';

/** Path prefixes reachable before platform onboarding is complete. */
export const PRE_ONBOARDING_PATH_PREFIXES = ['/apply', '/accept'] as const;

/**
 * Returns whether a pathname is allowed while onboarding is incomplete.
 *
 * @param pathname - Request pathname (no query string)
 */
export function isPreOnboardingPath(pathname: string): boolean {
  return PRE_ONBOARDING_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Returns whether the farm/user has finished post-signup onboarding (`/apply`).
 *
 * Matches the completion checks on the apply page: farm approval or accepted terms.
 *
 * @param userId - Authenticated user id
 * @param farmApproved - Whether `farm.approved` is true for the user's farm
 */
export async function hasCompletedPlatformOnboarding(
  userId: number,
  farmApproved: boolean
): Promise<boolean> {
  if (farmApproved) {
    return true;
  }

  return hasAcceptedAccountAgreement(userId);
}

/**
 * Redirects to `/apply` when the current user has not finished platform onboarding.
 */
export async function requirePlatformOnboardingComplete(): Promise<void> {
  const currentUser = await getAuthenticatedInfo();
  const isComplete = await hasCompletedPlatformOnboarding(
    currentUser.id,
    currentUser.approved
  );

  if (!isComplete) {
    redirect('/apply');
  }
}
