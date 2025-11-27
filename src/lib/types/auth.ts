// Copyright Todd Agriscience, Inc. All rights reserved.
import { AuthError } from '@supabase/supabase-js';

/** Response from the login() function from `@/lib/auth`. Handles the return type described here: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
 *
 * @property {object} data - The user data with three fields: `session`, `user`, and optionally `weakPassword`. `session` and `user` can be null, but the field itself will be present.
 * @property {AuthError | null} error - A generic error type from `@supabase/supabase-js` that extends `Error`. Can be null. */
export default interface LoginResponse {
  data: object;
  error: AuthError | null;
}
