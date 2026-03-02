// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { deleteAuthUserByEmail, resendEmailInvite } from '@/lib/auth';
import { user } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';

/** Updates a client's role. Takes no arguments, simply flips the user's role (viewer -> admin, admin -> viewer) */
export async function updateRole(): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();
    const newRole = result.role === 'Admin' ? 'Viewer' : 'Admin';

    await db.update(user).set({ role: newRole }).where(eq(user.id, result.id));

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}

/** Resends an email invitation.
 *
 * @param name The invited user's name
 * @param email The invited user's email*/
export async function resendVerificationEmail(
  email: string
): Promise<ActionResponse> {
  try {
    await getAuthenticatedInfo();

    await resendEmailInvite(email);

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}

/** Removes an invited user from the farm: deletes them from Supabase Auth and from the database.
 * Only allows uninviting a user on the same farm; cannot uninvite yourself.
 *
 * @param userId - The database id of the user to uninvite
 * @returns ActionResponse with error message or null on success
 */
export async function uninviteUser(userId: number): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();

    const [targetUser] = await db
      .select()
      .from(user)
      .where(and(eq(user.id, userId), eq(user.farmId, currentUser.farmId)))
      .limit(1);

    if (!targetUser) {
      return { error: 'User not found or you cannot uninvite this user' };
    }

    if (targetUser.id === currentUser.id) {
      return { error: 'You cannot uninvite yourself' };
    }

    const authError = await deleteAuthUserByEmail(targetUser.email);
    if (authError) {
      return { error: authError.message };
    }

    await db.delete(user).where(eq(user.id, userId));

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
