// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail } from '../auth';
import { user } from '../db/schema';
import { db } from '../db/schema/connection';
import { eq } from 'drizzle-orm';
import { UserSelect } from '@/lib/types/db';

/** User with a guaranteed farm (returned by getAuthenticatedInfo). */
export type AuthenticatedUser = Omit<UserSelect, 'farmId'> & { farmId: number };

const KNOWN_AUTH_ERROR_MESSAGES: readonly string[] = [
  "No email registered with this user's account",
  'User not found',
  'User is not associated with a farm',
];

function isKnownAuthError(error: Error): boolean {
  return KNOWN_AUTH_ERROR_MESSAGES.includes(error.message);
}

/**
 * Gets the authenticated user's information. Throws an error if the user
 * is not authenticated, not found, or not associated with a farm.
 *
 * At the moment, this simply returns all of the user's information for sake of type simplicity. This should be optimized in the future.
 *
 * @returns {Promise<AuthenticatedUser>} - The authenticated user's information
 * @throws {Error} - If user is not authenticated, not found, or not associated with a farm
 */
export async function getAuthenticatedInfo(): Promise<AuthenticatedUser> {
  const email = await getUserEmail();

  if (!email) {
    throw new Error("No email registered with this user's account");
  }

  try {
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      throw new Error('User not found');
    }

    if (currentUser.farmId === null || currentUser.farmId === undefined) {
      throw new Error('User is not associated with a farm');
    }

    return { ...currentUser, farmId: currentUser.farmId };
  } catch (error) {
    if (error instanceof Error && isKnownAuthError(error)) {
      throw error;
    }
    throw new Error('Error with querying for the current user.', {
      cause: error,
    });
  }
}
