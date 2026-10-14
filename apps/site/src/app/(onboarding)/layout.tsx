// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Suspense } from 'react';
import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';
import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { fontVariables } from '@/lib/fonts';
import '@/app/globals.css';
import { getCspNonce } from '@/lib/get-csp-nonce';

/** Desktop-only root that supports both token-validated signup and authenticated resume. */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getCspNonce();
  return (
    <html lang="en" className="authenticated-root bg-background-platform">
      <body
        className={`${fontVariables} authenticated-root min-h-screen bg-background-platform`}
      >
        <Suspense>
          <DesktopGate>
            <AuthenticatedHeader />
            {children}
          </DesktopGate>
        </Suspense>
      </body>
    </html>
  );
}
