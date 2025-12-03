// Copyright Todd Agriscience, Inc. All rights reserved.
import { AuthError } from '@supabase/supabase-js';

/** An error type, specifically used in the `login()` funtion from `@/lib/action/auth`. */
export type ZodError = {
  errors: string[];
  properties?: Record<string, { errors: string[] }>;
};

/** Response from the `login()` function from `@/lib/auth`, `@/lib/actions/auth`, and any other auth related functions. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
 *
 * @property {object} data - The user data with three fields: `session`, `user`, and optionally `weakPassword`. `session` and `user` can be null, but the field itself will be present.
 * @property {AuthError | ZodError | string | null} error - Could be a generic error type from `@supabase/supabase-js` that extends `Error`, A `ZodError` from an invalid auth request, a String error from everything going totally wrong, or null if no errors happened. */
export interface LoginResponse {
  data: object;
  error: AuthError | ZodError | string | null;
}

/** Response from the logout() function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-signout
 *
 * @property {AuthError | null} - An AuthError (Supabase error) or nothing at all. */
export interface LogoutResponse {
  error: AuthError | null;
}
