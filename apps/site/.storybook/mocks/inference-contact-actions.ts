// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { InferenceContactResult } from '@/app/(authenticated)/(shell)/(misc)/support/contact/types';

/**
 * Storybook-only replacement for the authenticated server action. Vite cannot
 * bundle its Node/database imports, and previews must never store client drafts.
 */
export async function prepareInferenceContact(): Promise<InferenceContactResult> {
  return {
    success: false,
    message: 'This preview keeps your questions here. No request was sent.',
  };
}
