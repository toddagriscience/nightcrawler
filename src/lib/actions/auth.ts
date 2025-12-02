'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import logger from '../logger';
import LoginResponse, { ZodError } from '../types/auth';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Logs a user in using Supabase on the server, and handles errors accordingly.
 *
 * DISCLAMER: THIS IS A SERVER ACTION.
 * PLEASE READ THE SERVER ACTION DOCUMENTATION BEFORE CALLING THIS IN RANDOM PLACES.
 *
 * @param formData The form data containing the email and password
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
    return {
      data: {},
      error: z.treeifyError(validated.error),
    };
  }

  const client = await createClient();
  try {
    const { data: _data, error } = await client.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      logger.warn(
        `Something went wrong when authenticating the user: ${error}`
      );
    }
    // return { data, error };
    redirect('/');
  } catch (error) {
    return {
      data: {},
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
