// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** IMPs page metadata */
export const metadata: Metadata = {
  title: 'IMPs',
  description: 'Manage Integrated Management Plans.',
};

/**
 * Layout for the IMPs page.
 * @param children - Page content
 */
export default function ImpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
