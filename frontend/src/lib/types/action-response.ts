// Copyright © Todd Agriscience, Inc. All rights reserved.

import { AuthError } from '@supabase/supabase-js';
import { ZodError } from './auth';

/** Generic interface for a response from a server action/API route.
 *
 * @property {object | null} data - Optional. If present, contents will vary.
 * @property {AuthError | ZodError | string | null} error - Could be a generic error type from `@supabase/supabase-js` that extends `Error`, A `ZodError` from an invalid auth request, a String error from everything going totally wrong, or null if no errors happened. */
export interface ActionResponse {
  data?: Record<string, string> | Record<string, number> | null;
  error: AuthError | ZodError | string | null;
}
