// Copyright © Todd Agriscience, Inc. All rights reserved.

import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';
import ApplicationReviewBanner from './components/application-review-banner';
import AuthErrorFallback from './components/auth-error-fallback';
import SidebarClient from './components/sidebar/sidebar-client';
import Sidebar from './components/sidebar/sidebar';
import { SidebarCollapseProvider } from './components/sidebar/sidebar-collapse-context';

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

  return (
    <>
      <ApplicationReviewBanner />
      {children}
    </>
  );
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
          <ViewerAgreementGate>
            <SidebarCollapseProvider>
              <div className="flex">
                <SidebarClient>
                  <Sidebar />
                </SidebarClient>
                <div className="flex-1 min-w-0 px-6 py-6">
                  <DesktopGate />
                  {children}
                </div>
              </div>
            </SidebarCollapseProvider>
          </ViewerAgreementGate>
        </Suspense>
      </body>
    </html>
  );
}
