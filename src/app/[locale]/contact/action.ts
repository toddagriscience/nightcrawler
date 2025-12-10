// Copyright Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  contactFormSchema,
  type ContactFormData,
} from '@/lib/zod-schemas/contact';
import logger from '@/lib/logger';
import { z } from 'zod';

/**
 * Submit contact form data to Google Sheets
 * @param {unknown} formData - Raw form data to be validated
 * @returns {Promise<{ success: boolean; error?: string }>} - Result of submission
 */
export async function submitToGoogleSheets(formData: unknown): Promise<{
  success: boolean;
  error?: string;
}> {
  // Validate input data with Zod schema
  const validated = contactFormSchema.safeParse(formData);

  if (!validated.success) {
    const errorMessage = z.treeifyError(validated.error);
    logger.warn('Contact form validation failed:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }

  const validatedData: ContactFormData = validated.data;

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    logger.error('Server configuration error: Missing GOOGLE_SCRIPT_URL');
    return {
      success: false,
      error: 'Server configuration error. Please try again later.',
    };
  }

  try {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('timestamp', Date.now().toString());

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 'success') {
      throw new Error(result.message || 'Submission failed');
    }

    return { success: true };
  } catch (error) {
    logger.error('Contact form submission error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
