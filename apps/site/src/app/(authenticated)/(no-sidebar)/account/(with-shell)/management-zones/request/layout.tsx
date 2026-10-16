// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Identifies the authenticated parcel-request page. */
export const metadata: Metadata = { title: 'Add management zone | Todd' };

/** Metadata shell for the client management-zone request form. */
export default function ManagementZoneRequestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
