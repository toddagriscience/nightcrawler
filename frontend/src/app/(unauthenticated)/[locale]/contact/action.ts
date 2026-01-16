// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import z from 'zod';
import { emailSchema } from '@/lib/zod-schemas/auth';
import { ActionResponse } from '@/lib/types/action-response';

/** USE ONLY ON THE SERVER SIDE!!! Submits contact information to the Google Sheet for keeping track of potential leads.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param {FormData} formData - The form data containing the contact information
 * @returns {void} - Returns nothing at the moment. This will likely be changed in the future for sake of error handling. */
export async function submitToGoogleSheetsHelper(formData: FormData) {
  const messageSchema = z
    .string()
    .max(1500, 'Message is too long.')
    .min(1, 'Message is too short');
  const message = formData.get('message');

  const validated = messageSchema.safeParse(message);

  if (!validated.success) {
    // Hacky, but it works for now
    throw new Error(z.treeifyError(validated.error).errors[0]);
  }

  const contactGoogleScriptUrl = process.env.CONTACT_GOOGLE_SCRIPT_URL;

  if (!contactGoogleScriptUrl) {
    throw new Error(
      'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL'
    );
  }

  try {
    await submitToGoogleSheets(formData, contactGoogleScriptUrl);
  } catch (error) {
    logger.error('Submission error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

/** USE ONLY ON THE SERVER SIDE!!! Submits an email to the Google Sheet for keeping track of externship emails.
 *
 * @param {unknown} _ - The initial state (unneeded in this function)
 * @param {FormData} formData - The form data containing the email and password
 * @returns {AuthResponse} - The response. The return type will be refactored into a generic in the future.
 * */
export async function submitEmail(
  _: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get('email');

  // We are not collecting names. If a name was entered, it was likely entered by a robot. Just act like the request succeeded if this form was filled out.
  const honeypot = formData.get('name');
  if (honeypot) {
    return { data: {}, error: null };
  }

  const validated = emailSchema.safeParse(email);

  if (!validated.success) {
    logger.info('Login credentials were not valid');
    return {
      data: {},
      error: z.treeifyError(validated.error),
    };
  }

  const externshipGoogleScriptUrl = process.env.EXTERNSHIP_GOOGLE_SCRIPT_URL;

  if (!externshipGoogleScriptUrl) {
    logger.warn('Could not find EXTERNSHIP_GOOGLE_SCRIPT_URL');
    return {
      data: {},
      error: 'Error submitting form.',
    };
  }

  try {
    await submitToGoogleSheets(formData, externshipGoogleScriptUrl);
    return { data: {}, error: null };
  } catch (error) {
    logger.error('Error when submitting email to Google Sheets: ' + error);
    return {
      data: {},
      error: 'Error saving email',
    };
  }
}
