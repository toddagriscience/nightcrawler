// Copyright © Todd Agriscience, Inc. All rights reserved.

import { DrizzleQueryError } from 'drizzle-orm';

/**
 * Maps low-level database errors to user-facing signup messages.
 *
 * @param error - Error thrown while creating farm or user rows
 */
export function formatSignupDatabaseError(error: unknown): string {
  if (error instanceof DrizzleQueryError) {
    const pgError = error.cause as
      | { code?: string; constraint?: string }
      | undefined;

    if (
      pgError?.code === '23505' &&
      pgError.constraint?.includes('user_email_unique')
    ) {
      return 'An account with this email already exists. Try logging in instead.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to create user in database';
}
