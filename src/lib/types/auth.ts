// Copyright © Todd Agriscience, Inc. All rights reserved.

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

/** Response from the `resetPassword()` function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
 *
 * @property {AuthError | ZodError | string | null} error - Could be a generic error type from `@supabase/supabase-js` that extends `Error`, A `ZodError` from an invalid auth request, a String error from everything going totally wrong, or null if no errors happened.
 * */
export interface SendResetPasswordEmailResponse {
  error: AuthError | ZodError | string | null;
}

/** Response from the `SendResetPasswordEmail()` function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
 *
 * @property {AuthError | ZodError | string | null} error - Could be a generic error type from `@supabase/supabase-js` that extends `Error`, A `ZodError` from an invalid auth request, a String error from everything going totally wrong, or null if no errors happened.
 * */
export interface UpdateUserResponse {
  error: AuthError | ZodError | string | null;
}

/** Password requirements for `/account/reset-password`. Supabase will also enforce everything except `isConfirmationSame` in case validation somehow fails.
 *
 * This is not handled by Zod for the sake of UX -- we want the user to be able to see exactly what they're missing, and Zod doesn't allow us to easily do that.
 *
 * @property {boolean} has8Characters - Is this password at least 8 characters?
 * @property {boolean} hasUpperCase - Does this password have at least 1 uppercase character?
 * @property {boolean} hasSpecialCharacter - Does this password have at least 1 special character?
 * @property {boolean} hasNumber - Does this password have at least 1 number?
 * @property {boolean} isConfirmationSame - Is the confirmation password the same as the new password?
 * */
export interface PasswordRequirements {
  has8Characters: boolean;
  hasUpperCase: boolean;
  hasSpecialCharacter: boolean;
  hasNumber: boolean;
  isConfirmationSame: boolean;
}
