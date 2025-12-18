// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

/** Submits data to a Google Sheets URL via a `FormData` object. For context, any Google Sheet will be expecting a POST request (handled by this action) with JSON-ified data like so:
 *
 * {"email": "test@example.com"}
 *
 * The `FormData` interface can handle this appropriately.
 * */
export async function submitToGoogleSheets(
  formData: FormData,
  googleScriptUrl: string
) {
  try {
    const url = new URL(googleScriptUrl);
    url.searchParams.append('timestamp', Date.now().toString());

    const submissionData: Record<string, string> = {};
    formData.forEach((value, key) => {
      submissionData[key] = value.toString();
    });

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
    console.error('Submission error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}
