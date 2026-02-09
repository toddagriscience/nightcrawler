// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail } from '../auth';
import { user } from '../db/schema';
import { db } from '../db/schema/connection';
import { eq } from 'drizzle-orm';
import { UserSelect } from '@/lib/types/db';

/** User with a guaranteed farm (returned by getAuthenticatedInfo). */
export type AuthenticatedUser = Omit<UserSelect, 'farmId'> & { farmId: number };

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

    if (!currentUser.farmId) {
      throw new Error('User is not associated with a farm');
    }

    return { ...currentUser, farmId: currentUser.farmId };
  } catch (error) {
    // If it's already an error we threw, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise wrap the unknown error
    throw new Error('Error with querying for the current user.');
  }
}
