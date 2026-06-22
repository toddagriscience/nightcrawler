// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { toast } from 'sonner';

/**
 * Shows a generic error toast when an internal-dashboard server action throws.
 *
 * Server actions now call `requireInternalAccount()` and throw on an expired or
 * missing session, so client handlers wrap their action calls and surface this
 * instead of letting the rejection go unhandled (no feedback for the user).
 */
export function notifyActionError() {
  toast.error(
    'Something went wrong. Your session may have expired — refresh and try again.'
  );
}
