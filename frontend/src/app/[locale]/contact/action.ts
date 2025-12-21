// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import z from 'zod';

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
