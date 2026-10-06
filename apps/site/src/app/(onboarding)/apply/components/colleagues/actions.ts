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
import { requireOnboardingStep } from '@/app/(onboarding)/apply/onboarding-access';

/** Resends an email invitation.
 *
 * @param email The invited user's email*/
export async function resendVerificationEmail(
  email: string
): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();
    assertCanEditFarm(currentUser, 'resend-verification-email');

    await requireOnboardingStep('team');
    const [teammate] = await db
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.email, email), eq(user.farmId, currentUser.farmId)))
      .limit(1);
    if (!teammate)
      throwActionError('This invitation does not belong to your farm.');

    const result = await resendEmailInvite(email);
    if (result instanceof Error) throwActionError(result.message);

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

    await requireOnboardingStep('team');

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
