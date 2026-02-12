// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { resendEmailInvite } from '@/lib/auth';
import { user } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';

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
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }

    await resendEmailInvite(email);

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
