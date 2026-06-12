// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  ensureApprovedApplicantAuthSession,
  getUserEmail,
  setPassword,
} from '@/lib/auth-server';
import { sendApprovedApplicantInvite } from '@nightcrawler/db/utils/send-approved-applicant-invite';
import {
  type ApplicantPrefill,
  buildSignupUrl,
} from '@nightcrawler/db/utils/extract-applicant-prefill';
import { formSubmission } from '@nightcrawler/db/schema';
import { createClient } from '@/lib/supabase/server';
import { farm, user, standardValues } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import {
  completeFormSubmissionSignup,
  resolveSignupContext,
  validateFormSubmissionSignupToken,
} from '@nightcrawler/db/queries';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import {
  formatActionResponseErrors,
  throwActionError,
} from '@/lib/utils/actions';
import { userInfo } from '@/lib/zod-schemas/onboarding';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formatSignupDatabaseError } from './signup-db-errors';

/** Schema for sign up validation - extends userInfo with password */
const signUpSchema = userInfo.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  applicationId: z.string().optional(),
  token: z.string().optional(),
});

/** Input for creating or updating farm and user records during signup. */
interface SignupRecordInput {
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
  phone: string;
  applicationId?: number;
}

/**
 * Creates or updates Postgres farm and user records for a signup attempt.
 *
 * @param input - Applicant profile and optional approved application id
 */
async function persistSignupRecords(input: SignupRecordInput): Promise<{
  user: typeof user.$inferSelect;
  farm: typeof farm.$inferSelect | { id: number } | null;
}> {
  const { firstName, lastName, farmName, email, phone, applicationId } = input;

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

    const [updatedUser] = await db
      .update(user)
      .set({
        firstName,
        lastName,
        phone,
      })
      .where(eq(user.id, existingUser.id))
      .returning();

    if (applicationId && existingUser.farmId) {
      await completeFormSubmissionSignup(applicationId, existingUser.farmId);
    }

    logger.info(`Signup reused existing user record for ${email}`);

    return {
      user: updatedUser ?? existingUser,
      farm: existingFarm ?? null,
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

  if (applicationId) {
    await completeFormSubmissionSignup(applicationId, result.farm.id);
  }

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
): Promise<never> {
  const { email, password, firstName } = input;

  try {
    await ensureApprovedApplicantAuthSession(email, password, firstName);
  } catch (error) {
    throwActionError(
      error instanceof Error
        ? error.message
        : 'Unable to activate your account. Use your onboarding link from Todd and try again.'
    );
  }

  const authenticatedEmail = await getUserEmail();

  if (
    !authenticatedEmail ||
    authenticatedEmail.toLowerCase() !== email.toLowerCase()
  ) {
    throwActionError(
      'Unable to start your session. Use your onboarding link and try again.'
    );
  }

  try {
    await persistSignupRecords(input);
  } catch (error) {
    logger.error(`Failed to create user/farm in database: ${error}`);
    throwActionError(formatSignupDatabaseError(error));
  }

  const { error: passwordError } = await setPassword(password);

  if (passwordError) {
    const message =
      formatActionResponseErrors(passwordError)[0] ?? 'Failed to set password';
    logger.warn(
      `Failed to set password for invited applicant ${email}: ${message}`
    );
    throwActionError(message);
  }

  const supabase = await createClient();
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      name: firstName,
    },
  });

  if (metadataError) {
    logger.warn(
      `Failed to update profile metadata for invited applicant ${email}: ${metadataError.message}`
    );
    throwActionError(metadataError.message);
  }

  redirect('/apply');
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

  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ??
    'https://toddagriscience.com'
  ).replace(/\/$/, '');

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
 * Reads a trimmed string from form data.
 *
 * @param value - Raw form entry
 */
function readFormString(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Prefers a submitted value and falls back to stored application prefill.
 *
 * @param formValue - Value from the signup form
 * @param prefillValue - Value from the approved application answers
 */
function coalescePrefill(formValue: string, prefillValue?: string): string {
  return formValue || prefillValue?.trim() || '';
}

/**
 * Completes approved-applicant signup (platform access forms only).
 *
 * @param _ - The initial state (unneeded in this function)
 * @param formData - The form data containing user, farm, application id, and token
 */
export async function signUp(
  _: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const applicationIdRaw = formData.get('applicationId')?.toString();
  const tokenRaw = formData.get('token')?.toString();
  let applicationPrefill: ApplicantPrefill | undefined;

  if (applicationIdRaw && tokenRaw) {
    const parsedApplicationId = Number.parseInt(applicationIdRaw, 10);

    if (Number.isFinite(parsedApplicationId)) {
      const signupContext = await resolveSignupContext(
        parsedApplicationId,
        tokenRaw
      );
      applicationPrefill = signupContext?.prefill;
    }
  }

  const rawData = {
    firstName: coalescePrefill(
      readFormString(formData.get('firstName')),
      applicationPrefill?.firstName
    ),
    lastName: coalescePrefill(
      readFormString(formData.get('lastName')),
      applicationPrefill?.lastName
    ),
    farmName: coalescePrefill(
      readFormString(formData.get('farmName')),
      applicationPrefill?.farmName
    ),
    email: coalescePrefill(
      readFormString(formData.get('email')),
      applicationPrefill?.email
    ),
    phone: coalescePrefill(
      readFormString(formData.get('phone')),
      applicationPrefill?.phone
    ),
    password: formData.get('password'),
    applicationId: applicationIdRaw,
    token: tokenRaw,
  };

  const validated = signUpSchema.safeParse(rawData);

  if (!validated.success) {
    logger.info('Sign up data was not valid');
    throwActionError(z.treeifyError(validated.error));
  }

  const {
    firstName,
    lastName,
    farmName,
    email,
    phone,
    password,
    applicationId,
    token,
  } = validated.data;

  if (!applicationId || !token) {
    throwActionError(
      'Account setup requires a valid onboarding link from your approval email.'
    );
  }

  const parsedApplicationId = Number.parseInt(applicationId, 10);

  if (!Number.isFinite(parsedApplicationId)) {
    throwActionError('This signup link is invalid or expired.');
  }

  const validatedApplication = await validateFormSubmissionSignupToken(
    parsedApplicationId,
    token,
    email
  );

  if (!validatedApplication) {
    throwActionError('This signup link is invalid or expired.');
  }

  await completeApprovedApplicantSignup({
    firstName,
    lastName,
    farmName,
    email,
    phone,
    password,
    applicationId: validatedApplication.applicationId,
  });

  return { data: null };
}
