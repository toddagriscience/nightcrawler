// Copyright Todd Agriscience, Inc. All rights reserved.

import { supabase } from '@/supabaseClient';
import logger from './logger';

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
): Promise<object | null> {
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
    return data;
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
