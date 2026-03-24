// Copyright © Todd Agriscience, Inc. All rights reserved.

import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { redirect } from 'next/navigation';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

/**
 * Layout for authenticated/platform routes
 * Applies platform background color and includes the authenticated header
 * Wraps the children in an AuthErrorTrigger to handle testing UI for authentication errors
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The authenticated layout
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getAuthenticatedInfo();

  if (currentUser.role === 'Viewer') {
    const hasAcceptedAgreement = await hasAcceptedAccountAgreement(
      currentUser.id
    );
    if (!hasAcceptedAgreement) {
      redirect('/account/agreement');
    }
  }

  return (
    <html lang="en" className="authenticated-root bg-background-platform">
      <body
        className={`${fontVariables} authenticated-root bg-background-platform min-h-screen`}
      >
        {children}
        <DesktopGate />
      </body>
    </html>
  );
}
