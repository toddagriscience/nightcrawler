// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { setPassword } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import logger from '../logger';
import { AuthResponse, AuthResponseTypes } from '../types/auth';
import { emailSchema, loginSchema } from '../zod-schemas/auth';

/** This file is STRICTLY for SERVER SIDE authentication. Server-side authentication should be generally preferred over client-side authentication. You can read more about this in `./src/lib/auth.ts` */

/**
 * ONLY USE ON SERVER SIDE! Logs a user in using Supabase on the server, and handles errors accordingly.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param formData - The form data containing the email and password
 * @returns {AuthResponse} - An interface describing the object described here: https://supabase.com/docs/reference/javascript/auth-signinanonymously
 */
export async function login(
  _: unknown,
  formData: FormData
): Promise<AuthResponse> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    logger.info('Login credentials were not valid');
    return {
      data: {},
      error: z.treeifyError(validated.error),
      responseType: AuthResponseTypes.Login,
    };
  }

  const client = await createClient();
  try {
    const { error } = await client.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      logger.warn(
        `Something went wrong when authenticating the user: ${error}`
      );
      return {
        data: {},
        error: error instanceof Error ? error.message : 'An error occured',
        responseType: AuthResponseTypes.Login,
      };
    }
  } catch (error) {
    logger.info(`An error occured when authenticating the user: ${error}`);
    return {
      data: {},
      error: error instanceof Error ? error.message : 'An error occurred',
      responseType: AuthResponseTypes.Login,
    };
  }
  redirect('/');
}

/** ONLY USE ON SERVER SIDE! Sends a password reset request given an email.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param formData - The form data containing the email and password
 * @returns {AuthResponse} - An interface describing the object described here: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
 * */
export async function sendResetPasswordEmail(
  _: unknown,
  formData: FormData
): Promise<AuthResponse> {
  const email = formData.get('email');

  const validated = emailSchema.safeParse(email);

  if (!validated.success) {
    logger.warn('Email was not valid');
    return {
      error: z.treeifyError(validated.error),
      responseType: AuthResponseTypes.SendResetPasswordEmail,
    };
  }

  const client = await createClient();

  try {
    const { error } = await client.auth.resetPasswordForEmail(validated.data);

    if (error) {
      logger.warn(
        `Something went wrong when resetting the user's password: ${error}`
      );
      return {
        error: error,
        responseType: AuthResponseTypes.SendResetPasswordEmail,
      };
    }

    return {
      error: null,
      responseType: AuthResponseTypes.SendResetPasswordEmail,
    };
  } catch (error) {
    logger.warn(
      `Something went wrong when resetting the user's password: ${error}`
    );
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      responseType: AuthResponseTypes.SendResetPasswordEmail,
    };
  }
}

/** ONLY USE ON SERVER SIDE! Updates a user with the given information. As of 12/03/2025, this only supports updating the password.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param formData - The form data containing the email and password
 * @returns {AuthResponse} - An interface describing the object described here: https://supabase.com/docs/reference/javascript/auth-updateuser
 * */
export async function updateUser(
  _: unknown,
  formData: FormData
): Promise<AuthResponse> {
  // No need to check if the new password is strong enough. Supabase will handle this for us.
  const newPassword = formData.get('newPassword');
  const confirmNewPassword = formData.get('confirmNewPassword');

  if (
    !newPassword ||
    !confirmNewPassword ||
    confirmNewPassword !== newPassword
  ) {
    return {
      error: "Passwords don't match",
      responseType: AuthResponseTypes.UpdateUser,
    };
  }

  try {
    const { error } = await setPassword(newPassword.toString());

    if (error) {
      logger.warn(
        `Something went wrong when resetting the user's password: ${error}`
      );
      return { error: error, responseType: AuthResponseTypes.UpdateUser };
    }

    return { error: null, responseType: AuthResponseTypes.UpdateUser };
  } catch (error) {
    logger.warn(
      `Something went wrong when resetting the user's password: ${error}`
    );
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      responseType: AuthResponseTypes.UpdateUser,
    };
  }
}
