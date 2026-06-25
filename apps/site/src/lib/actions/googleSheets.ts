// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import logger from '@/lib/logger';

/**
 * Posts form data to a Google Apps Script endpoint as JSON, e.g.
 * `{"email": "test@example.com"}`.
 *
 * Intentionally NOT exported: in a `'use server'` module every export becomes a
 * directly-callable server action, so exporting a function that takes a
 * caller-supplied URL would let any client drive a server-side `fetch()` to an
 * arbitrary destination (SSRF). The target URL must therefore come from a
 * trusted, env-bound wrapper below — never from the caller.
 */
async function submitToGoogleSheets(
  formData: FormData | Object,
  googleScriptUrl: string
) {
  try {
    const url = new URL(googleScriptUrl);
    url.searchParams.append('timestamp', Date.now().toString());

    const submissionData: Record<string, string> = {};

    if (formData instanceof FormData) {
      formData.forEach((value, key) => {
        submissionData[key] = value.toString();
      });
    } else {
      // Not the cleanest logic but it works
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          try {
            submissionData[key] = value.toString();
          } catch {
            submissionData[key] = '';
          }
        } else {
          submissionData[key] = '';
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
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
    logger.error('Submission error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

/**
 * Server action: submits a contact-page inquiry to the contact Google Sheet.
 *
 * The destination is bound to `CONTACT_GOOGLE_SCRIPT_URL` on the server, so the
 * caller cannot control where the request is sent (prevents SSRF). Throws if
 * the environment variable is not configured.
 *
 * @param formData - Submitted contact form payload
 */
export async function submitContactToSheets(formData: FormData | Object) {
  const googleScriptUrl = process.env.CONTACT_GOOGLE_SCRIPT_URL;
  if (!googleScriptUrl) {
    throw new Error(
      'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL'
    );
  }

  return submitToGoogleSheets(formData, googleScriptUrl);
}
