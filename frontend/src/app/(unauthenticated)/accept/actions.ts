// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { isVerified, setPassword, signIn } from '@/lib/auth';
import { user } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import { UserInsert } from '@/lib/types/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AcceptInvite, acceptInviteSchema } from './types';

/** Accepts an invitation, updates user information, and sets their password.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param {FormData} formData - The form data containing user information and optional password
 * @returns {Promise<ActionResponse>} - Returns a success message if successful, or an error if not
 */
export async function acceptInvite(
  formData: AcceptInvite
): Promise<ActionResponse> {
  const verified = await isVerified();

  if (!verified) {
    logger.warn('Attempted to accept invitation for unverified user');
    return {
      error:
        'User email is not verified. Please verify your email before accepting the invitation.',
    };
  }

  const validated = acceptInviteSchema.safeParse(formData);

  if (!validated.success) {
    logger.info('Invitation acceptance data was not valid');
    return {
      error: z.treeifyError(validated.error),
    };
  }

  const {
    firstName,
    lastName,
    phone,
    job,
    didOwnAndControlParcel,
    didManageAndControl,
    password,
    confirmPassword,
  } = validated.data;

  try {
    // Get current user to ensure we're updating the right one
    const currentUser = await getAuthenticatedInfo();

    if (password) {
      if (password != confirmPassword) {
        return { error: "Passwords don't match" };
      }

      const { error: authError } = await setPassword(password);
      if (authError) {
        const message =
          typeof authError === 'string'
            ? authError
            : 'message' in authError
              ? authError.message
              : authError.errors[0];
        logger.warn(
          `Failed to set password during invite acceptance: ${message}`
        );
        return { error: message };
      }
    } else {
      return { error: 'No password provided' };
    }

    const { error } = await signIn(validated.data.email, password);

    if (error) {
      return { error: error };
    }

    const updateData: Partial<UserInsert> = {
      firstName,
      lastName,
      phone,
      job,
      didOwnAndControlParcel,
      didManageAndControl,
    };

    await db.update(user).set(updateData).where(eq(user.id, currentUser.id));

    logger.info(
      `User ${currentUser.email} successfully accepted invitation and updated profile.`
    );
  } catch (error) {
    logger.error(
      `Failed to update user info during invite acceptance: ${error}`
    );

    if (error instanceof Error) {
      logger.warn(
        `Failed to get authenticated info during invite acceptance: ${error.message}`
      );
      return { error: error.message };
    }

    return {
      error: 'An unexpected error occurred',
    };
  }

  redirect('/');
}
