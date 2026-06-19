// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { deleteAuthUserByEmail, resendEmailInvite } from '@/lib/auth-server';
import { user } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import { assertCanEditFarm } from '@/lib/utils/farm-rbac';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';

/** Updates a client's role. Takes no arguments, simply flips the user's role (viewer -> admin, admin -> viewer) */
export async function updateRole(): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();
    assertCanEditFarm(result, 'update-role');
    const newRole = result.role === 'Admin' ? 'Viewer' : 'Admin';

    await db.update(user).set({ role: newRole }).where(eq(user.id, result.id));

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
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
    const currentUser = await getAuthenticatedInfo();
    assertCanEditFarm(currentUser, 'resend-verification-email');

    await resendEmailInvite(email);

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
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
    assertCanEditFarm(currentUser, 'uninvite-user');

    const [targetUser] = await db
      .select()
      .from(user)
      .where(and(eq(user.id, userId), eq(user.farmId, currentUser.farmId)))
      .limit(1);

    if (!targetUser) {
      throwActionError('User not found or you cannot uninvite this user');
    }

    if (targetUser.id === currentUser.id) {
      throwActionError('You cannot uninvite yourself');
    }

    const authError = await deleteAuthUserByEmail(targetUser.email);
    if (authError) {
      throwActionError(authError.message);
    }

    await db.delete(user).where(eq(user.id, userId));

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
  }
}
