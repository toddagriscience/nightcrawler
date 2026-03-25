// Copyright © Todd Agriscience, Inc. All rights reserved.

import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { Suspense } from 'react';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

/**
 * Layout for the viewer agreement page.
 * Children are wrapped in Suspense because the page needs cookies/DB access.
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
        <Suspense>{children}</Suspense>
        <DesktopGate />
      </body>
    </html>
  );
}
