// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';
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
    const msg = validated.error.issues[0]?.message ?? 'Invalid submission.';
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
    const payload = new FormData();
    const { name, lastKnownEmail, response } = validated.data;

    if (name) payload.set('name', name);
    if (lastKnownEmail) payload.set('lastKnownEmail', lastKnownEmail);
    if (response) payload.set('response', response);

    await submitToGoogleSheets(payload, scriptUrl);

    return { error: null, data: null };
  } catch (err) {
    logger.error('Public inquiry submission error:', err);
    return {
      error: err instanceof Error ? err.message : 'An unknown error occurred.',
      data: null,
    };
  }
}
