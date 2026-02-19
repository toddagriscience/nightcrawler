// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Metadata for the account section
 */
export const metadata: Metadata = {
  title: {
    default: 'Account | Todd',
    template: '%s | Todd',
  },
};

/**
 * Root layout for the account section — provides metadata only.
 * The actual UI layout (header, sidebar) is in the (settings) route group.
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
