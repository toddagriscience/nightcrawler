// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { signUpUser } from '@/lib/auth';
import { farm, user } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import { userInfo } from '@/lib/zod-schemas/onboarding';
import { z } from 'zod';
import logger from '@/lib/logger';

/** Schema for sign up validation - extends userInfo with password */
const signUpSchema = userInfo.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

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
  };

  const validated = signUpSchema.safeParse(rawData);

  if (!validated.success) {
    logger.info('Sign up data was not valid');
    return {
      error: z.treeifyError(validated.error),
    };
  }

  const { firstName, lastName, farmName, email, phone, password } =
    validated.data;

  // Sign up the user with Supabase
  const signUpResult = await signUpUser(email, password, firstName);

  if (signUpResult instanceof Error) {
    logger.warn(`Failed to sign up user in Supabase: ${signUpResult.message}`);
    return {
      error: signUpResult.message,
    };
  }

  try {
    // Create the farm first
    const [newFarm] = await db
      .insert(farm)
      .values({
        informalName: farmName,
      })
      .returning({ id: farm.id });

    // Create the user record linked to the farm
    const [newUser] = await db
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

    logger.info(`Successfully created user ${email} with farm ${farmName}`);

    return {
      data: { user: newUser, farm: newFarm },
      error: null,
    };
  } catch (error) {
    logger.error(`Failed to create user/farm in database: ${error}`);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create user in database',
    };
  }
}
