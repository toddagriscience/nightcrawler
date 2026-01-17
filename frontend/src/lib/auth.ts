// Copyright © Todd Agriscience, Inc. All rights reserved.

import logger from './logger';
import { AuthResponse, AuthResponseTypes } from './types/auth';
import { createClient as createBrowserClient } from './supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createClient as createServerClient } from './supabase/server';

/**  Unless ABSOLUTELY necessary, prefer server-side auth over client-side authentication for sake of security and leaning into Next.js's standard patterns.
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
 * CLIENT SIDE FUNCTION. Logs a user in using Supabase, and handles errors accordingly.
 *
 * @param email The email of the user
 * @param password The password of the user
 * @returns {Promise<AuthResponse>} - An interface, and the object described here: https://supabase.com/docs/reference/javascript/auth-signinanonymously
 * */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
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
    return { data, error, responseType: AuthResponseTypes.Login };
  } catch (error) {
    logger.warn(`Something went wrong when authenticating the user: ${error}`);
  }
  return {
    data: {},
    error: new AuthError('Something went wrong. Please contact support.'),
    responseType: AuthResponseTypes.Login,
  };
}

/** CLIENT SIDE FUNCTION. Logs a user out, only if they're authenticated. Logging a user out is easiest and simplest to do client-side, which is why this function is utilized in production (unlike the client-side login function -- logging in is handled server-side).
 *
 * @returns {Promise<AuthResponse>} - An interface, and the object described here: https://supabase.com/docs/reference/javascript/auth-signout */
export async function logout(): Promise<AuthResponse> {
  try {
    const client = createBrowserClient();
    const isAuthenticated = await checkAuthenticated();

    if (isAuthenticated) {
      const { error } = await client.auth.signOut();

      if (error) {
        logger.warn(`Something went wrong when logging out the user: ${error}`);
        return {
          error: new AuthError(
            `Something went wrong when logging out the user: ${error}`
          ),
          responseType: AuthResponseTypes.Logout,
        };
      }
    }
  } catch (error) {
    logger.warn(`Something went wrong when logging out the user: ${error}`);
    return {
      error: new AuthError(
        `Something went wrong when logging out the user: ${error}`
      ),
      responseType: AuthResponseTypes.Logout,
    };
  }

  redirect('/');
}

/**
 * CLIENT SIDE FUNCTION. Returns whether a user is authenticated or not. Uses `getUser()` and not `getSession()` because of the potential security risks that come with it.
 *
 * @returns {Promise<boolean>} - True if the user is authenticated. */
export async function checkAuthenticated(): Promise<boolean> {
  const {
    data: { user },
  } = await createBrowserClient().auth.getUser();

  return !(user == null);
}

/** SERVER SIDE FUNCTION. Returns the email of a user, if they're logged in. This effectively "doubles" as a server side version of `checkAuthenticated()`
 *
 * @returns {Promise<string | null>} - A string (the user's email) if authenticated, null if they aren't authenticated.*/
export async function getUserEmail(): Promise<string | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims.email || null;
}

/** SERVER SIDE FUNCTION. Signs up (or creates) a user and sends a confirmation email.
 *
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * */
export async function signUpUser(
  email: string,
  password: string,
  name: string
): Promise<object | Error> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://toddagriscience.com/login',
      data: {
        // This is for the email template
        first_name: name,
        // This is for Supabase Display Name, nothing more than QOL
        name: name,
      },
    },
  });

  if (error) {
    return error;
  }

  return data;
}
