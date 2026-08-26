// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AuthErrorFallback from './components/auth-error-fallback';

/**
 * Error boundary for the authenticated route group. Renders the same page the
 * layout falls back to, so both authentication failure paths stay in sync.
 * @returns {JSX.Element} The authentication error page
 */
export default function Error() {
  return <AuthErrorFallback />;
}
