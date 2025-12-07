// Copyright Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Generate metadata for account section
 * @returns {Metadata} - The metadata for the account section
 */
export const metadata: Metadata = {
  title: {
    default: 'Account | Todd',
    template: '%s | Todd',
  },
};

/**
 * Layout for account section
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The account layout
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
