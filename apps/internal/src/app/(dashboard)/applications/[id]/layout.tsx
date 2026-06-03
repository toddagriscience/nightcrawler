// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Application detail page metadata */
export const metadata: Metadata = {
  title: 'Application',
};

/**
 * Application detail layout shell.
 *
 * @param props - Route children
 */
export default function ApplicationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
