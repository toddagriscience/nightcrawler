// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fontVariables } from '../../lib/fonts';
import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
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
            {children}
          </div>
        </DesktopGate>
      </body>
    </html>
  );
}
