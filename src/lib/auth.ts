// Copyright Todd Agriscience, Inc. All rights reserved.

import { supabase } from '@/supabaseClient';
import logger from './logger';
import LoginResponse from './types/auth';

/** Auth, assuming credentials are correct, is handled in the following manner:
 *
 * 1. User sends a request to Supabase
 * 2. Supabase returns authentication credentials
 * 3. User attempts to access a protected page
 * 4. Authentication credentials are validated optimistically, and the base UI loads. Note that no data is loaded yet.
 * 5. Request with authentication credentials is sent to backend for secure validation, data is returned.
 *
 * Note that the authentication process required to load a page and the authentication process required to fetch data are two completely different processes.
 *
 * The following resource from NextJS may be useful in understanding how we handle authentication: https://nextjs.org/docs/app/guides/authentication#authorization
 * */

/** Any and all authentication helpers should be placed in this file. */

/**
 * Logs a user in using Supabase, and handles errors accordingly.
 *
 * @param email The email of the user
 * @param password The password of the user
 * @returns {object} - The object described here: https://supabase.com/docs/reference/javascript/auth-signinanonymously
 * */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      logger.warn(
        `Something went wrong when authenticating the user: ${error}`
      );
    }
    return { data, error };
  } catch (error) {
    logger.warn(`Something went wrong when authenticating the user: ${error}`);
  }
  return null;
}

/**
 * Returns whether a user is verified or not. Uses `getUser()` and not `getSession()` because of the potential security risks that come with it.
 *
 * @returns {boolean} - True if the user is authenticated. */
export async function checkAuthenticated(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return !(user == null);
}
