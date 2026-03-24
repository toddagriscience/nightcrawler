// Copyright © Todd Agriscience, Inc. All rights reserved.

import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

/**
 * Layout for viewer agreement routes.
 * Applies platform background styles while users complete agreement acceptance.
 *
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The viewer agreement layout
 */
export default function ViewerAgreementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
