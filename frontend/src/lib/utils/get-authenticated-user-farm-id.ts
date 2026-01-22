// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail } from '../auth';
import { user } from '../db/schema';
import { db } from '../db/schema/connection';
import { eq } from 'drizzle-orm';
import { UserSelect } from '@/lib/types/db';

/**
 * Gets the authenticated user's requested information. Returns an error ActionResponse if the user
 * is not authenticated, not found, or not associated with a farm.
 *
 * At the moment, this simply returns all of the user's information for sake of type simplicity. This should be optimized in the future.
 *
 * @returns {Promise<ActionResponse>} - If successful, the requested user's information via an ActionResponse, else an ActionResponse containing an error
 */
export async function getAuthenticatedInfo(): Promise<
  UserSelect | { error: string }
> {
  const email = await getUserEmail();

  if (!email) {
    return { error: "No email registered with this user's account" };
  }

  try {
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      return { error: 'User not found' };
    }

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    return currentUser;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error with querying for the current user.' };
  }
}
