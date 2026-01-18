// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getUserEmail } from '../auth';
import { db, user } from '../db/schema';
import { ActionResponse } from '../types/action-response';
import { eq } from 'drizzle-orm';

/**
 * Gets the authenticated user's farm ID. Returns an error ActionResponse if the user
 * is not authenticated, not found, or not associated with a farm.
 *
 * @returns {Promise<ActionResponse>} - If successful, the farm ID, else an ActionResponse containing an error
 */
export async function getAuthenticatedUserFarmId(): Promise<ActionResponse> {
  const email = await getUserEmail();

  if (!email) {
    return { error: "No email registered with this user's account" };
  }

  try {
    const [currentUser] = await db
      .select({ farmId: user.farmId })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      return { error: 'User not found' };
    }

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    return { data: { farmId: currentUser.farmId }, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error with querying for the current user.' };
  }
}

/**
 * Standardizes all the different error types produced by the login action into a list. Contrary to the majority of other functions in this file, this function can be used in any location in the codebase. It's just a helper function for formatting.
 *
 * @param state The current form action state
 * @returns A list of all the errors
 */
export function formatActionResponseErrors(
  state: ActionResponse | null
): string[] {
  if (!state) return [];

  const { error } = state;
  if (!error) return [];
  if (typeof error === 'string') return [error];
  if (error instanceof Error) return [error.message];

  const { errors } = error;
  if (errors) return errors;

  return [];
}
