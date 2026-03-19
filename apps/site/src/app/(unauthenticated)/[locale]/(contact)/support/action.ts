// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import z from 'zod';
import { publicInquirySchema } from './types';

function getString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

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

  const scriptUrl = process.env.CONTACT_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    throwActionError(
      'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL'
    );
  }

  try {
    // Per review: if we validated successfully, just submit the original formData
    await submitToGoogleSheets(formData, scriptUrl);
    return { data: null };
  } catch (err) {
    logger.error('Public inquiry submission error:', err);
    throwActionError(
      err instanceof Error ? err.message : 'An unknown error occurred.'
    );
  }
}
