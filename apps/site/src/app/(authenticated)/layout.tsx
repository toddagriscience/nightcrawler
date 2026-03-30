// Copyright © Todd Agriscience, Inc. All rights reserved.

import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';
import AuthErrorFallback from './components/auth-error-fallback';

/**
 * Checks whether the current viewer has accepted the account agreement.
 * Redirects to the agreement page when acceptance is missing.
 */
async function ViewerAgreementGate({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser;
  try {
    currentUser = await getAuthenticatedInfo();
  } catch {
    return <AuthErrorFallback />;
  }

  if (currentUser.role === 'Viewer') {
    const hasAcceptedAgreement = await hasAcceptedAccountAgreement(
      currentUser.id
    );
    if (!hasAcceptedAgreement) {
      redirect('/account/agreement');
    }
  }

  return <>{children}</>;
}

/**
 * Root layout for all authenticated routes.
 * Children are wrapped in Suspense because the agreement gate needs cookies/DB access.
 *
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The authenticated layout
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="authenticated-root bg-background-platform">
      <body
        className={`${fontVariables} authenticated-root bg-background-platform min-h-screen`}
      >
        <Suspense>
          <ViewerAgreementGate>{children}</ViewerAgreementGate>
        </Suspense>
        <DesktopGate />
      </body>
    </html>
  );
}
