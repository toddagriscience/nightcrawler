// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Applications page metadata */
export const metadata: Metadata = {
  title: 'Applications',
};

/**
 * Applications layout shell.
 *
 * @param props - Route children
 */
export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
