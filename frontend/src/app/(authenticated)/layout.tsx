// Copyright © Todd Agriscience, Inc. All rights reserved.

import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';
import ConditionedAuthenticatedHeader from '@/components/common/authenticated-header/conditioned-header';
import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

/**
 * Layout for authenticated/platform routes
 * Applies platform background color and includes the authenticated header
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The authenticated layout
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <DesktopGate>
          <div className="bg-background-platform authenticated-root min-h-screen">
            <ConditionedAuthenticatedHeader>
              <AuthenticatedHeader />
            </ConditionedAuthenticatedHeader>
            {children}
          </div>
        </DesktopGate>
      </body>
    </html>
  );
}
