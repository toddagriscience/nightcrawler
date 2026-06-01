// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  getUserEmail,
  setPassword,
  signIn,
  signUpUser,
} from '@/lib/auth-server';
import { createClient } from '@/lib/supabase/server';
import { farm, user, standardValues } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import {
  completePlatformAccessSignup,
  validatePlatformAccessSignupToken,
} from '@nightcrawler/db/queries';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import {
  formatActionResponseErrors,
  throwActionError,
} from '@/lib/utils/actions';
import { userInfo } from '@/lib/zod-schemas/onboarding';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formatSignupDatabaseError } from './signup-db-errors';

/** Schema for sign up validation - extends userInfo with password */
const signUpSchema = userInfo.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  applicationId: z.string().optional(),
  token: z.string().optional(),
});

/** Input for creating or updating farm and user records during signup. */
interface SignupRecordInput {
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
  phone: string;
  applicationId?: number;
}

/**
 * Creates or updates Postgres farm and user records for a signup attempt.
 *
 * @param input - Applicant profile and optional approved application id
 */
async function persistSignupRecords(input: SignupRecordInput): Promise<{
  user: typeof user.$inferSelect;
  farm: typeof farm.$inferSelect | { id: number } | null;
}> {
  const { firstName, lastName, farmName, email, phone, applicationId } = input;

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser) {
    const [existingFarm] = existingUser.farmId
      ? await db
          .select()
          .from(farm)
          .where(eq(farm.id, existingUser.farmId))
          .limit(1)
      : [];

    const [updatedUser] = await db
      .update(user)
      .set({
        firstName,
        lastName,
        phone,
      })
      .where(eq(user.id, existingUser.id))
      .returning();

    if (applicationId && existingUser.farmId) {
      await completePlatformAccessSignup(applicationId, existingUser.farmId);
    }

    logger.info(`Signup reused existing user record for ${email}`);

    return {
      user: updatedUser ?? existingUser,
      farm: existingFarm ?? null,
    };
  }

  const result = await db.transaction(async (tx) => {
    const [newFarm] = await tx
      .insert(farm)
      .values({
        informalName: farmName,
      })
      .returning({ id: farm.id });

    await tx
      .insert(standardValues)
      .values({ farmId: newFarm.id })
      .onConflictDoNothing({ target: standardValues.farmId });

    const [newUser] = await tx
      .insert(user)
      .values({
        farmId: newFarm.id,
        firstName,
        lastName,
        email,
        phone,
        role: 'Admin',
      })
      .returning();

    return { user: newUser, farm: newFarm };
  });

  if (applicationId) {
    await completePlatformAccessSignup(applicationId, result.farm.id);
  }

  logger.info(`Successfully created user ${email} with farm ${farmName}`);

  return result;
}

/**
 * Completes signup for an approved platform-access applicant who arrived via magic link.
 *
 * @param input - Validated signup payload and application id
 */
async function completeApprovedApplicantSignup(
  input: SignupRecordInput & { password: string }
): Promise<never> {
  const { email, password, firstName } = input;
  const authenticatedEmail = await getUserEmail();

  if (!authenticatedEmail) {
    throwActionError(
      'Open the link from your approval email to continue setting up your account.'
    );
  }

  if (authenticatedEmail.toLowerCase() !== email.toLowerCase()) {
    throwActionError(
      'You are signed in with a different email. Open the approval link from the same inbox.'
    );
  }

  const { error: passwordError } = await setPassword(password);

  if (passwordError) {
    const message =
      formatActionResponseErrors(passwordError)[0] ?? 'Failed to set password';
    logger.warn(
      `Failed to set password for invited applicant ${email}: ${message}`
    );
    throwActionError(message);
  }

  const supabase = await createClient();
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      name: firstName,
      email_verified: true,
    },
  });

  if (metadataError) {
    logger.warn(
      `Failed to update profile metadata for invited applicant ${email}: ${metadataError.message}`
    );
    throwActionError(metadataError.message);
  }

  const { error: signInError } = await signIn(email, password);

  if (signInError) {
    throwActionError(signInError);
  }

  try {
    await persistSignupRecords(input);
  } catch (error) {
    logger.error(`Failed to create user/farm in database: ${error}`);
    throwActionError(formatSignupDatabaseError(error));
  }

  redirect('/apply');
}

/** Signs up a user with Supabase and creates the corresponding farm and user records in the database.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param {FormData} formData - The form data containing user and farm information
 * @returns {Promise<ActionResponse>} - Returns the created user data if successful, or an error if not
 */
export async function signUp(
  _: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    farmName: formData.get('farmName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    applicationId: formData.get('applicationId')?.toString(),
    token: formData.get('token')?.toString(),
  };

  const validated = signUpSchema.safeParse(rawData);

  if (!validated.success) {
    logger.info('Sign up data was not valid');
    throwActionError(z.treeifyError(validated.error));
  }

  const {
    firstName,
    lastName,
    farmName,
    email,
    phone,
    password,
    applicationId,
    token,
  } = validated.data;

  let validatedApplicationId: number | undefined;

  if (applicationId && token) {
    const parsedApplicationId = Number.parseInt(applicationId, 10);

    if (!Number.isFinite(parsedApplicationId)) {
      throwActionError('This signup link is invalid or expired.');
    }

    const validatedApplication = await validatePlatformAccessSignupToken(
      parsedApplicationId,
      token,
      email
    );

    if (!validatedApplication) {
      throwActionError('This signup link is invalid or expired.');
    }

    validatedApplicationId = validatedApplication.applicationId;

    await completeApprovedApplicantSignup({
      firstName,
      lastName,
      farmName,
      email,
      phone,
      password,
      applicationId: validatedApplicationId,
    });
  }

  const signUpResult = await signUpUser(email, password, firstName);

  if (signUpResult instanceof Error) {
    logger.warn(`Failed to sign up user in Supabase: ${signUpResult.message}`);
    throwActionError(signUpResult.message);
  }

  try {
    const result = await persistSignupRecords({
      firstName,
      lastName,
      farmName,
      email,
      phone,
    });

    return {
      data: result,
    };
  } catch (error) {
    logger.error(`Failed to create user/farm in database: ${error}`);
    throwActionError(formatSignupDatabaseError(error));
  }
}
