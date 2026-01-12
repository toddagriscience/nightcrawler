// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import logger from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';
import z from 'zod';

// Make these match the modal's <input name="..."> attributes.
const schema = z.object({
  name: z.string().trim().max(200, 'Name is too long.').optional(),
  lastKnownEmail: z
    .string()
    .trim()
    .email('Please enter a valid email.')
    .max(320, 'Email is too long.')
    .optional(),
  response: z
    .string()
    .trim()
    .max(1500, 'Response is too long (max 1500 characters).')
    .optional(),
});

function readOptionalString(
  formData: FormData,
  key: string
): string | undefined {
  const v = formData.get(key);
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export async function submitPublicInquiry(
  formData: FormData
): Promise<ActionResponse> {
  // Read fields (all optional)
  const raw = {
    name: readOptionalString(formData, 'name'),
    lastKnownEmail: readOptionalString(formData, 'lastKnownEmail'),
    response: readOptionalString(formData, 'response'),
  };

  // Validate: only enforces rules if a value is present
  const validated = schema.safeParse(raw);
  if (!validated.success) {
    const msg = validated.error.issues[0]?.message ?? 'Invalid submission.';
    return { error: msg, data: null };
  }

  // Use the same env var pattern as contact, unless the team has a dedicated one.
  const scriptUrl = process.env.CONTACT_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return {
      error: 'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL',
      data: null,
    };
  }

  try {
    // Ensure we only submit the fields we care about (optional, but clean)
    const payload = new FormData();
    if (validated.data.name) payload.set('name', validated.data.name);
    if (validated.data.lastKnownEmail)
      payload.set('lastKnownEmail', validated.data.lastKnownEmail);
    if (validated.data.response)
      payload.set('response', validated.data.response);

    // Using the pre-existing Google Sheets helper
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
