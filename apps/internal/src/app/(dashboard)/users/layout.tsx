// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Users page metadata */
export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage user accounts on the Todd platform.',
};

/**
 * Layout for the users page.
 * @param children - Page content
 */
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
