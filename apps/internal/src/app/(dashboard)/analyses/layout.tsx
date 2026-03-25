// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Analyses page metadata */
export const metadata: Metadata = {
  title: 'Analyses',
  description: 'Manage soil analyses and mineral data.',
};

/**
 * Layout for the analyses page.
 * @param children - Page content
 */
export default function AnalysesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
