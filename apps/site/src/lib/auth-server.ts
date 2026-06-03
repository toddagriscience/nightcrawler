// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { createClient as createServerClient } from './supabase/server';
import { AuthResponse, AuthResponseTypes } from './types/auth';

/** Unless ABSOLUTELY necessary, prefer server-side auth over client-side authentication for sake of security and leaning into Next.js's standard patterns.
 *  Note that the authentication process required to load a page and the authentication process required to fetch data are two completely different processes.
 *  The following resource from NextJS may be useful in understanding how we handle authentication: https://nextjs.org/docs/app/guides/authentication#authorization
 */

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

/** SERVER SIDE FUNCTION. Returns the email verification status of the user. If they're not logged in or something goes wrong with `getClaims()`, this function will simply return false. */
export async function isVerified(): Promise<boolean> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return false;
  }

  if (!data.claims.user_metadata) {
    return false;
  }

  if (!('email_verified' in data.claims.user_metadata)) {
    return false;
  }

  // This is a boolean field
  return data.claims.user_metadata.email_verified;
}

/** SERVER SIDE FUNCTION. Signs up (or creates) a user and sends a confirmation email.
 *
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @param {string} name - The user's name, for QOL
 * @returns {Promise<object | Error>} - An object with user data if successful, an error if not successful. */
export async function signUpUser(
  email: string,
  password: string,
  name: string
): Promise<object | Error> {
  const supabase = await createServerClient();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '') ??
    'https://toddagriscience.com';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/apply`,
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

/** SERVER SIDE FUNCTION. Invites a user via email.
 *
 * @param {string} email - The user's email
 * @params {string} name - The user's first name, for QOL
 * @returns {Promise<object | Error>} - An object with user data if successful, an error if not successful. */
export async function inviteUser(
  email: string,
  name: string
): Promise<object | Error> {
  const supabase = await createServerClient(process.env.SUPABASE_SECRET_KEY);
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/auth/accept-invite',
    data: {
      // This is for the email template
      first_name: name,
      // This is for Supabase Display Name, nothing more than QOL
      name: name,
    },
  });

  if (error) {
    return error;
  }

  return data;
}

/**
 * Ensures the applicant has a Supabase session before completing approved signup.
 * Uses the existing magic-link session when present; otherwise creates or updates the
 * auth user without sending another confirmation email.
 *
 * @param email - Applicant email from the validated application link
 * @param password - Password the applicant chose on the signup form
 * @param firstName - Applicant first name for auth metadata
 */
export async function ensureApprovedApplicantAuthSession(
  email: string,
  password: string,
  firstName: string
): Promise<void> {
  const sessionEmail = await getUserEmail();
  const normalizedEmail = email.trim().toLowerCase();

  if (sessionEmail?.toLowerCase() === normalizedEmail) {
    return;
  }

  if (sessionEmail) {
    throw new Error(
      'You are signed in with a different email. Open the approval link from the same inbox.'
    );
  }

  const signInResult = await signIn(email, password);

  if (!signInResult.error) {
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !secretKey) {
    throw new Error(
      'Server configuration is incomplete. Contact support to finish activating your account.'
    );
  }

  const supabaseAdmin = createSupabaseAdminClient(
    `https://${projectId}.supabase.co`,
    secretKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      name: firstName,
      email_verified: true,
    },
  });

  if (!createError) {
    const afterCreateSignIn = await signIn(email, password);

    if (!afterCreateSignIn.error) {
      return;
    }

    throw new Error(
      formatActionResponseErrors(afterCreateSignIn.error)[0] ??
        'Failed to sign in after creating your account.'
    );
  }

  const createMessage = createError.message.toLowerCase();

  if (
    !createMessage.includes('already') &&
    !createMessage.includes('registered') &&
    !createMessage.includes('exists')
  ) {
    throw new Error(createError.message);
  }

  const { data: listedUsers, error: listError } =
    await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (listError) {
    throw new Error(listError.message);
  }

  const existingUser = listedUsers.users.find(
    (user) => user.email?.toLowerCase() === normalizedEmail
  );

  if (!existingUser) {
    throw new Error(createError.message);
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    existingUser.id,
    {
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        name: firstName,
        email_verified: true,
      },
    }
  );

  if (updateError) {
    throw new Error(updateError.message);
  }

  const afterUpdateSignIn = await signIn(email, password);

  if (afterUpdateSignIn.error) {
    throw new Error(
      formatActionResponseErrors(afterUpdateSignIn.error)[0] ??
        'Failed to sign in after updating your account.'
    );
  }
}

/** SERVER SIDE FUNCTION. Sets a user's password.
 *
 * @param {string} password - The user's new password
 * @returns {Promise<AuthResponse>} - An interface describing the object described here: https://supabase.com/docs/reference/javascript/auth-updateuser
 */
export async function setPassword(password: string): Promise<AuthResponse> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.updateUser({
    password,
    data: {
      email_verified: true,
    },
  });

  return { data, error, responseType: AuthResponseTypes.UpdateUser };
}

/** SERVER SIDE FUNCTION. Logs in a user. */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    password,
    email,
  });

  return { data, error, responseType: AuthResponseTypes.SignIn };
}

/** SERVER SIDE FUNCTION. Resend an invite. */
export async function resendEmailInvite(
  email: string
): Promise<object | Error> {
  const supabase = await createServerClient(process.env.SUPABASE_SECRET_KEY);
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/auth/accept-invite',
    },
  });

  if (error) {
    return error;
  }

  return data;
}

/** SERVER SIDE FUNCTION.
 * delete_auth_user_by_email is equivalent to the following function:
 *
 *   WITH deleted AS (
 *     DELETE FROM auth.users WHERE email = lower(email_address)
 *     RETURNING id
 *   )
 *   SELECT count(*)::integer FROM deleted;
 *
 * Returns null on success or if user not in Auth.
 *
 * @param {string} email - The user's email
 * @returns {Promise<Error | null>} - An error if the RPC failed, null if successful or user not found in auth */
export async function deleteAuthUserByEmail(
  email: string
): Promise<Error | null> {
  const supabase = await createServerClient(process.env.SUPABASE_SECRET_KEY);
  const { error } = await supabase.rpc('delete_auth_user_by_email', {
    email_address: email,
  });
  return error ?? null;
}
