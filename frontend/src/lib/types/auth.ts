// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ActionResponse } from './action-response';

/** An error type, specifically used in the `login()` funtion from `@/lib/action/auth`. */
export type ZodError = {
  errors: string[];
  properties?: Record<string, { errors: string[] }>;
};

/*
 * @typedef AuthResponseTypes
 * @property Login - Response from the `login()` function from `@/lib/auth`, `@/lib/actions/auth`, and any other auth related functions. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
 * @property Logout - Response from the logout() function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-signout
 * @property SendResetPasswordEmail - Response from the `resetPassword()` function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
 * @property UpdateUser - Response from the `SendResetPasswordEmail()` function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
 */
export enum AuthResponseTypes {
  Login,
  Logout,
  SendResetPasswordEmail,
  UpdateUser,
}

/** Generic interface for a response from a server action/API route involving authentication.
 *
 * @property {AuthResponseTypes} responseType - The type of the response
 * */
export interface AuthResponse extends ActionResponse {
  responseType: AuthResponseTypes;
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
