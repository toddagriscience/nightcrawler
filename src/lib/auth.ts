// Copyright Todd Agriscience, Inc. All rights reserved.

import logger from './logger';
import { LoginResponse, LogoutResponse } from './types/auth';
import { createClient as createBrowserClient } from './supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

/** This file is STRICTLY for CLIENT SIDE AUTH. Unless ABSOLUTELY necessary, prefer server-side auth over client-side authentication for sake of security and leaning into Next.js's standard patterns.
 *
 * With that:
 *
 * Client side auth + request to API, assuming credentials are correct, is handled in the following manner:
 *
 * 1. User attempts to
 * 2. Supabase returns authentication credentials
 * 3. User attempts to access a protected page
 * 4. Authentication credentials are validated optimistically, and the base UI loads. Note that no data is loaded yet.
 * 5. Request with authentication credentials is sent to backend for secure validation, data is returned.
 *
 * Note that the authentication process required to load a page and the authentication process required to fetch data are two completely different processes.
 *
 * The following resource from NextJS may be useful in understanding how we handle authentication: https://nextjs.org/docs/app/guides/authentication#authorization
 */

/**
 * ONLY USE ON CLIENT SIDE! Logs a user in using Supabase, and handles errors accordingly.
 *
 * @param email The email of the user
 * @param password The password of the user
 * @returns {Promise<LoginResponse>} - An interface, and the object described here: https://supabase.com/docs/reference/javascript/auth-signinanonymously
 * */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const { data, error } = await createBrowserClient().auth.signInWithPassword(
      {
        email,
        password,
      }
    );
    if (error) {
      logger.warn(
        `Something went wrong when authenticating the user: ${error}`
      );
    }
    return { data, error };
  } catch (error) {
    logger.warn(`Something went wrong when authenticating the user: ${error}`);
  }
  return {
    data: {},
    error: new AuthError('Something went wrong. Please contact support.'),
  };
}

/** ONLY USE ON CLIENT SIDE! Logs a user out, only if they're authenticated. Logging a user out is easiest and simplest to do client-side, which is why this function is utilized in production (unlike the client-side login function -- logging in is handled server-side).
 *
 * @returns {Promise<LogoutResponse>} - An interface, and the object described here: https://supabase.com/docs/reference/javascript/auth-signout */
export async function logout(): Promise<LogoutResponse> {
  try {
    const client = createBrowserClient();
    const isAuthenticated = await checkAuthenticated();

    if (isAuthenticated) {
      const { error } = await client.auth.signOut();

      if (error) {
        logger.warn(`Something went wrong when logging out the user: ${error}`);
      }
    }
  } catch (error) {
    logger.warn(`Something went wrong when logging out the user: ${error}`);
    return {
      error: new AuthError(
        `Something went wrong when logging out the user: ${error}`
      ),
    };
  }

  redirect('/');
}

/**
 * ONLY USE ON CLIENT SIDE! Returns whether a user is authenticated or not. Uses `getUser()` and not `getSession()` because of the potential security risks that come with it.
 *
 * @returns {Promise<boolean>} - True if the user is authenticated. */
export async function checkAuthenticated(): Promise<boolean> {
  const {
    data: { user },
  } = await createBrowserClient().auth.getUser();

  return !(user == null);
}

/**
 * Standardizes all the different error types produced by the login action into a list. Contrary to the majority of other functions in this file, this function can be used in any location in the codebase. It's just a helper function for formatting.
 *
 * @param state The current form action state
 * @returns A list of all the errors
 */
export function loginErrors(state: LoginResponse | null): string[] {
  if (!state?.error) return [];
  if (typeof state.error === 'string') return [state.error];
  if (state.error instanceof Error) return [state.error.message];
  if ('errors' in state.error) return state.error.errors;
  return [];
}
