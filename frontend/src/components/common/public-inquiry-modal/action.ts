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
    name: typeof formData.get('name') === 'string' ? formData.get('name') : '',
    lastKnownEmail:
      typeof formData.get('lastKnownEmail') === 'string'
        ? formData.get('lastKnownEmail')
        : '',
    response:
      typeof formData.get('response') === 'string'
        ? formData.get('response')
        : '',
  };

  const validated = publicInquirySchema.safeParse(raw);
  if (!validated.success) {
    const msg = validated.error.issues[0]?.message ?? 'Invalid submission.';
    return { error: msg, data: null };
  }

  const name =
    validated.data.name?.trim?.() ?? String(validated.data.name ?? '').trim();
  const lastKnownEmail =
    validated.data.lastKnownEmail?.trim?.() ??
    String(validated.data.lastKnownEmail ?? '').trim();
  const response =
    validated.data.response?.trim?.() ??
    String(validated.data.response ?? '').trim();

  if (!name) return { error: 'Name is required.', data: null };
  if (!lastKnownEmail) return { error: 'Email is required.', data: null };
  if (!response) return { error: 'Response is required.', data: null };

  const scriptUrl = process.env.CONTACT_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return {
      error: 'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL',
      data: null,
    };
  }

  try {
    const payload = new FormData();
    payload.set('name', name);
    payload.set('lastKnownEmail', lastKnownEmail);
    payload.set('response', response);

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
