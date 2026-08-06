// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitContactToSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import z from 'zod';
import { publicInquirySchema } from './types';

/**
 * Reads a trimmed string field from submitted form data.
 *
 * @param formData - Submitted form payload
 * @param key - Field name to read
 * @returns Trimmed string value, or empty string when missing
 */
function getString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Validates and submits a public inquiry from the `/contact` page to Google Sheets.
 *
 * @param formData - Raw form submission payload
 * @returns Empty success response when submission succeeds
 */
export async function submitPublicInquiry(
  formData: FormData
): Promise<ActionResponse> {
  const raw = {
    name: getString(formData, 'name'),
    lastKnownEmail: getString(formData, 'lastKnownEmail'),
    response: getString(formData, 'response'),
  };

  const validated = publicInquirySchema.safeParse(raw);
  if (!validated.success) {
    throwActionError(z.treeifyError(validated.error));
  }

  try {
    await submitContactToSheets(formData);
    return { data: null };
  } catch (err) {
    // Log the full error server-side for diagnosis, but never forward the raw
    // message to the client — it can expose internal details (upstream HTTP
    // status, missing config, stack text). Return a safe, generic message.
    logger.error('Public inquiry submission error:', err);
    throwActionError(
      'We could not submit your inquiry right now. Please try again later.'
    );
  }
}
