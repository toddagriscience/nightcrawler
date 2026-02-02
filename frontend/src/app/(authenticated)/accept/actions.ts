// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import 'server-only';

import { isVerified, setPassword } from '@/lib/auth';
import { user } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { acceptInviteSchema } from '@/lib/zod-schemas/accept';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import z from 'zod';

/** Accepts an invitation, updates user information, and sets their password.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param {FormData} formData - The form data containing user information and optional password
 * @returns {Promise<ActionResponse>} - Returns a success message if successful, or an error if not
 */
export async function acceptInvite(
  _: unknown,
  formData: FormData
): Promise<ActionResponse> {
  // If the user's email is not verified (see isVerified()) return an error immediately.
  const verified = await isVerified();

  if (!verified) {
    logger.warn('Attempted to accept invitation for unverified user');
    return {
      error:
        'User email is not verified. Please verify your email before accepting the invitation.',
    };
  }

  const rawData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
    job: formData.get('job'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const validated = acceptInviteSchema.safeParse(rawData);

  if (!validated.success) {
    logger.info('Invitation acceptance data was not valid');
    return {
      error: z.treeifyError(validated.error),
    };
  }

  const { firstName, lastName, phone, job, password } = validated.data;

  // Get current user to ensure we're updating the right one
  const currentUser = await getAuthenticatedInfo();
  if ('error' in currentUser) {
    logger.warn(
      `Failed to get authenticated info during invite acceptance: ${currentUser.error}`
    );
    return { error: currentUser.error };
  }

  try {
    // 1. Update password if provided. This also sets verified to true in Supabase metadata.
    if (password) {
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
    }

    // 2. Update user info in database
    await db
      .update(user)
      .set({
        firstName,
        lastName,
        phone,
        job,
      })
      .where(eq(user.id, currentUser.id));

    logger.info(
      `User ${currentUser.email} successfully accepted invitation and updated profile.`
    );
  } catch (error) {
    logger.error(
      `Failed to update user info during invite acceptance: ${error}`
    );
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }

  redirect('/');
}
