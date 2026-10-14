// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Internal inbox metadata. */
export const metadata: Metadata = {
  title: 'Client inquiries',
  robots: { index: false, follow: false },
};

/** Metadata boundary for the internal client inquiries inbox. */
export default function InquiriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
