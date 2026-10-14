// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { ensureApprovedApplicantAuthSession } from '@/lib/auth-server';
import { sendApprovedApplicantInvite } from '@nightcrawler/db/utils/send-approved-applicant-invite';
import { buildSignupUrl } from '@nightcrawler/db/utils/extract-applicant-prefill';
import { formSubmission } from '@nightcrawler/db/schema';
import { createClient } from '@/lib/supabase/server';
import { getAuthRedirectBaseUrl } from '@/lib/env';
import { farm, user, standardValues } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import {
  completeFormSubmissionSignup,
  isFormSubmissionSignupAlreadyCompleted,
  resolveSignupContext,
  validateFormSubmissionSignupToken,
} from '@nightcrawler/db/queries';
import logger from '@/lib/logger';
import {
  enforceRateLimit,
  publicEmailRateLimit,
  signupRateLimit,
} from '@/lib/rate-limit';
import { ActionResponse } from '@/lib/types/action-response';
import {
  formatActionResponseErrors,
  throwActionError,
} from '@/lib/utils/actions';
import { userInfo } from '@/lib/zod-schemas/onboarding';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { formatSignupDatabaseError } from './signup-db-errors';

/** Stored applicant identity and the password requirements shown in the form. */
const signUpSchema = userInfo
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/\d/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

/** Input for creating or updating farm and user records during signup. */
interface SignupRecordInput {
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
  phone: string;
  applicationId: number;
}

/**
 * Creates or updates Postgres farm and user records for a signup attempt.
 *
 * @param input - Profile from the approved application
 */
async function persistSignupRecords(input: SignupRecordInput): Promise<{
  user: typeof user.$inferSelect;
  farm: typeof farm.$inferSelect | { id: number };
}> {
  const { firstName, lastName, farmName, email, phone } = input;

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser) {
    const [existingFarm] = existingUser.farmId
      ? await db
          .select()
          .from(farm)
          .where(eq(farm.id, existingUser.farmId))
          .limit(1)
      : [];

    if (!existingFarm || existingUser.role !== 'Admin') {
      throwActionError(
        'This email is already associated with another account. Contact support to finish onboarding.'
      );
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        firstName,
        lastName,
        phone,
      })
      .where(eq(user.id, existingUser.id))
      .returning();

    logger.info(`Signup reused existing user record for ${email}`);

    return {
      user: updatedUser ?? existingUser,
      farm: existingFarm,
    };
  }

  const result = await db.transaction(async (tx) => {
    const [newFarm] = await tx
      .insert(farm)
      .values({
        informalName: farmName,
      })
      .returning({ id: farm.id });

    await tx
      .insert(standardValues)
      .values({ farmId: newFarm.id })
      .onConflictDoNothing({ target: standardValues.farmId });

    const [newUser] = await tx
      .insert(user)
      .values({
        farmId: newFarm.id,
        firstName,
        lastName,
        email,
        phone,
        role: 'Admin',
      })
      .returning();

    return { user: newUser, farm: newFarm };
  });

  logger.info(`Successfully created user ${email} with farm ${farmName}`);

  return result;
}

/**
 * Completes signup for an approved platform-access applicant using the application token.
 *
 * @param input - Validated signup payload and application id
 */
async function completeApprovedApplicantSignup(
  input: SignupRecordInput & { password: string }
): Promise<void> {
  const { email, password, firstName, applicationId } = input;
  let supabase = await createClient();
  const { data: initialAuthData } = await supabase.auth.getUser();
  const initialAuthUser = initialAuthData.user;

  if (
    initialAuthUser?.email &&
    initialAuthUser.email.toLowerCase() !== email.toLowerCase()
  ) {
    throwActionError(
      'You are signed in with a different email. Open the approval link from the same inbox.'
    );
  }

  const passwordAlreadySet =
    initialAuthUser?.email?.toLowerCase() === email.toLowerCase() &&
    initialAuthUser.user_metadata.onboarding_applicant === true &&
    initialAuthUser.user_metadata.onboarding_password_set === true &&
    initialAuthUser.user_metadata.onboarding_application_id === applicationId;

  if (!passwordAlreadySet) {
    try {
      await ensureApprovedApplicantAuthSession(email, password, firstName);
    } catch (error) {
      throwActionError(
        error instanceof Error
          ? error.message
          : 'Unable to activate your account. Use your onboarding link from Todd and try again.'
      );
    }
  }

  supabase = await createClient();
  const { data: authenticatedData, error: sessionError } =
    await supabase.auth.getUser();
  const authenticatedUser = authenticatedData.user;
  const authenticatedEmail = authenticatedUser?.email;

  if (
    sessionError ||
    !authenticatedEmail ||
    authenticatedEmail.toLowerCase() !== email.toLowerCase()
  ) {
    throwActionError(
      'Unable to start your session. Use your onboarding link and try again.'
    );
  }

  if (
    authenticatedUser?.user_metadata.onboarding_applicant === true &&
    authenticatedUser.user_metadata.onboarding_password_set === true
  ) {
    if (
      authenticatedUser.user_metadata.onboarding_application_id !==
      applicationId
    ) {
      throwActionError(
        'Your password has already been set. Sign in to continue onboarding.'
      );
    }

    const [existingUser] = await db
      .select({ farmId: user.farmId, role: user.role })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!existingUser?.farmId || existingUser.role !== 'Admin') {
      throwActionError(
        'Unable to resume onboarding. Contact support for help.'
      );
    }

    await completeFormSubmissionSignup(applicationId, existingUser.farmId);
    return;
  }

  let signupRecords: Awaited<ReturnType<typeof persistSignupRecords>>;
  try {
    signupRecords = await persistSignupRecords(input);
  } catch (error) {
    logger.error(`Failed to create user/farm in database: ${error}`);
    throwActionError(formatSignupDatabaseError(error));
  }

  const onboardingMetadata = {
    first_name: firstName,
    name: firstName,
    email_verified: true,
    onboarding_applicant: true,
    onboarding_application_id: applicationId,
    onboarding_password_set: true,
    onboarding_team_step_done: false,
    onboarding_payment_continued: false,
  };
  let { error: passwordError } = await supabase.auth.updateUser({
    password,
    data: onboardingMetadata,
  });

  // Session bootstrap may already have set this exact password. Prove that it
  // works before recording completion without a second password update.
  if (passwordError?.code === 'same_password') {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      throwActionError(signInError.message);
    }

    const result = await supabase.auth.updateUser({ data: onboardingMetadata });
    passwordError = result.error;
  }

  if (passwordError) {
    const message =
      formatActionResponseErrors(passwordError)[0] ?? 'Failed to set password';
    throwActionError(message);
  }

  await completeFormSubmissionSignup(applicationId, signupRecords.farm.id);
}

/**
 * Resends the approved-applicant activation email for a valid application signup link.
 *
 * @param input - Application id, signup token, and applicant email from the link
 */
export async function resendApprovedApplicantActivationEmail(input: {
  applicationId: number;
  token: string;
  email: string;
}): Promise<{ sent: boolean; error?: string }> {
  await enforceRateLimit(
    publicEmailRateLimit,
    'Too many activation email requests. Please try again later.'
  );

  const validated = await validateFormSubmissionSignupToken(
    input.applicationId,
    input.token,
    input.email
  );

  if (!validated) {
    throwActionError('This signup link is invalid or expired.');
  }

  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !secretKey) {
    throwActionError(
      'Activation email cannot be sent right now. Contact support for help.'
    );
  }

  const baseUrl = getAuthRedirectBaseUrl();

  const [application] = await db
    .select()
    .from(formSubmission)
    .where(eq(formSubmission.id, validated.applicationId))
    .limit(1);

  const onboardingUrl = application?.signupToken
    ? buildSignupUrl(baseUrl, {
        applicationId: validated.applicationId,
        signupToken: application.signupToken,
      })
    : null;

  if (!onboardingUrl) {
    throwActionError('This signup link is invalid or expired.');
  }

  const result = await sendApprovedApplicantInvite({
    email: validated.email,
    onboardingUrl,
    projectId,
    secretKey,
  });

  if (!result.sent) {
    throwActionError(
      result.error ?? 'Failed to send activation email. Please try again.'
    );
  }

  return { sent: true };
}

/**
 * Completes approved-applicant signup (platform access forms only).
 *
 * @param _ - The initial state (unneeded in this function)
 * @param formData - Application id, token, password, and password confirmation
 */
export async function signUp(
  _: unknown,
  formData: FormData
): Promise<ActionResponse> {
  await enforceRateLimit(signupRateLimit);

  const applicationIdRaw = formData.get('applicationId')?.toString();
  const tokenRaw = formData.get('token')?.toString();

  if (!applicationIdRaw || !tokenRaw?.trim()) {
    throwActionError(
      'Account setup requires a valid onboarding link from your approval email.'
    );
  }

  const parsedApplicationId = Number(applicationIdRaw);

  if (
    !Number.isSafeInteger(parsedApplicationId) ||
    parsedApplicationId <= 0 ||
    parsedApplicationId > 2_147_483_647
  ) {
    throwActionError('This signup link is invalid or expired.');
  }

  return db.transaction(async (transaction) => {
    // Namespace 1148 isolates approved-applicant signup locks. Only an advisory
    // lock is held here: existing signup queries use their own DB connections.
    // Fail fast on overlap instead of reserving pool connections while waiting.
    const lock = await transaction.execute<{ acquired: boolean }>(sql`
      SELECT pg_try_advisory_xact_lock(1148, ${parsedApplicationId}) AS acquired
    `);
    if (!lock.rows.at(0)?.acquired) {
      throwActionError(
        'Account setup is already in progress. Please try again shortly.'
      );
    }

    // Read the token and auth state only after owning the application lock.
    const signupContext = await resolveSignupContext(
      parsedApplicationId,
      tokenRaw
    );

    if (!signupContext) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      const authenticatedEmail = data.user?.email;

      if (
        !error &&
        authenticatedEmail &&
        (await isFormSubmissionSignupAlreadyCompleted(
          parsedApplicationId,
          tokenRaw,
          authenticatedEmail
        ))
      ) {
        return { data: null };
      }

      throwActionError('This signup link is invalid or expired.');
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const authenticatedUser = authData.user;
    const applicantEmail = signupContext.email.trim().toLowerCase();

    if (!authError && authenticatedUser?.email) {
      if (authenticatedUser.email.toLowerCase() !== applicantEmail) {
        throwActionError(
          'You are signed in with a different email. Open the approval link from the same inbox.'
        );
      }

      if (
        authenticatedUser.user_metadata.onboarding_applicant === true &&
        authenticatedUser.user_metadata.onboarding_password_set === true
      ) {
        if (
          authenticatedUser.user_metadata.onboarding_application_id !==
          signupContext.applicationId
        ) {
          throwActionError(
            'Your password has already been set. Sign in to continue onboarding.'
          );
        }

        const [existingUser] = await db
          .select({ farmId: user.farmId, role: user.role })
          .from(user)
          .where(eq(user.email, applicantEmail))
          .limit(1);

        if (!existingUser?.farmId || existingUser.role !== 'Admin') {
          throwActionError(
            'Unable to resume onboarding. Contact support for help.'
          );
        }

        await completeFormSubmissionSignup(
          signupContext.applicationId,
          existingUser.farmId
        );
        return { data: null };
      }
    }

    const validated = signUpSchema.safeParse({
      firstName: signupContext.prefill.firstName?.trim() ?? '',
      lastName: signupContext.prefill.lastName?.trim() ?? '',
      farmName: signupContext.prefill.farmName?.trim() ?? '',
      email: applicantEmail,
      phone: signupContext.prefill.phone?.trim() ?? '',
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validated.success) {
      throwActionError(z.treeifyError(validated.error));
    }

    const { firstName, lastName, farmName, email, phone, password } =
      validated.data;

    await completeApprovedApplicantSignup({
      firstName,
      lastName,
      farmName,
      email,
      phone,
      password,
      applicationId: signupContext.applicationId,
    });

    return { data: null };
  });
}
