// Copyright Todd Agriscience, Inc. All rights reserved.

'use server';

interface FormData {
  fullName: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

/**
 * Submit get started form data to backend
 * @param {FormData} formData - The form data to submit
 * @returns {Promise<{success: boolean}>} - Success status
 */
export async function submitGetStartedForm(formData: FormData) {
  const MAX_MESSAGE_LENGTH = 1500;

  if (formData.message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(
      `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`
    );
  }

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    throw new Error('Server configuration error: Missing GOOGLE_SCRIPT_URL');
  }

  try {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('timestamp', Date.now().toString());
    url.searchParams.append('formType', 'get-started');

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
    console.error('Submission error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}
