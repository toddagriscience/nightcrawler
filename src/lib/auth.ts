// Copyright Todd LLC, All rights reserved.

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
export default async function login(
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
  } finally {
    return null;
  }
}
