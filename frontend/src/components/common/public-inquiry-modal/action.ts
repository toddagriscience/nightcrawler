// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';
import z from 'zod';
import { publicInquirySchema } from './types';

export async function submitPublicInquiry(
  formData: FormData
): Promise<ActionResponse> {
  const raw = {
    name: formData.get('name'),
    lastKnownEmail: formData.get('lastKnownEmail'),
    response: formData.get('response'),
  };

  const validated = publicInquirySchema.safeParse(raw);
  if (!validated.success) {
    const tree = z.treeifyError(validated.error);

    const msg =
      tree.errors[0] ??
      tree.properties?.name?.errors[0] ??
      tree.properties?.lastKnownEmail?.errors[0] ??
      tree.properties?.response?.errors[0] ??
      'Invalid submission.';

    return { error: msg, data: null };
  }

  const scriptUrl = process.env.CONTACT_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return {
      error: 'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL',
      data: null,
    };
  }

  try {
    // Per review: if we've validated successfully, just submit the original formData
    await submitToGoogleSheets(formData, scriptUrl);

    return { error: null, data: null };
  } catch (err) {
    logger.error('Public inquiry submission error:', err);
    return {
      error: err instanceof Error ? err.message : 'An unknown error occurred.',
      data: null,
    };
  }
}
