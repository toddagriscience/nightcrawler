// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail } from '../auth';
import { db, user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ActionResponse } from '../types/action-response';
import { SelectedFields } from 'drizzle-orm/pg-core';

/**
 * Gets the authenticated user's requested information. Returns an error ActionResponse if the user
 * is not authenticated, not found, or not associated with a farm.
 *
 * @returns {Promise<ActionResponse>} - If successful, the requested user's information via an ActionResponse, else an ActionResponse containing an error
 */
export async function getAuthenticatedInfo(
  fields: SelectedFields
): Promise<ActionResponse> {
  const email = await getUserEmail();

  if (!email) {
    return { error: "No email registered with this user's account" };
  }

  try {
    const [currentUser] = await db
      .select(fields)
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      return { error: 'User not found' };
    }

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    return { data: { ...currentUser }, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error with querying for the current user.' };
  }
}
