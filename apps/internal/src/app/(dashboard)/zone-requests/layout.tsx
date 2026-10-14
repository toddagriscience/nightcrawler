// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Identifies the sample-kit operations queue. */
export const metadata: Metadata = { title: 'Management zone requests' };

/** Metadata shell for the management-zone request queue. */
export default function ZoneRequestsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
