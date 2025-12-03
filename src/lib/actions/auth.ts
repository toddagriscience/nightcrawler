// Copyright Todd Agriscience, Inc. All rights reserved.
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import logger from '../logger';
import { LoginResponse } from '../types/auth';
import { emailSchema, loginSchema } from '../zod-schemas/auth';
import { z } from 'zod';

/** This file is STRICTLY for SERVER SIDE authentication. Server-side authentication should be generally preferred over client-side authentication. You can read more about this in `./src/lib/auth.ts` */

/**
 * ONLY USE ON SERVER SIDE! Logs a user in using Supabase on the server, and handles errors accordingly.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param formData - The form data containing the email and password
 * @returns {object} - The object described here: https://supabase.com/docs/reference/javascript/auth-signinanonymously
 */
export async function login(
  _: unknown,
  formData: FormData
): Promise<LoginResponse> {
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
      };
    }
  } catch (error) {
    logger.info(`An error occured when authenticating the user: ${error}`);
    return {
      data: {},
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
  redirect('/');
}

/** ONLY USE ON SERVER SIDE! Sends a password reset request given an email.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param formData The form data containing the email and password
 * @returns {object} - ?
 * */
export async function resetPassword(_: unknown, formData: FormData) {
  const email = formData.get('email');

  const validated = emailSchema.safeParse(email);

  if (!validated.success) {
    logger.warn('Email was not valid');
    return { error: z.treeifyError(validated.error) };
  }

  const client = await createClient();

  try {
    const { error } = await client.auth.resetPasswordForEmail(validated.data);

    if (error) {
      logger.warn(
        `Something went wrong when resetting the user's password: ${error}`
      );
      return { error: error };
    }
  } catch (error) {
    logger.warn(
      `Something went wrong when resetting the user's password: ${error}`
    );
    return { error: error };
  }
}
