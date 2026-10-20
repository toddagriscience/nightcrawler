// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Metadata for internal catalog administration. */
export const metadata: Metadata = {
  title: 'General IMP catalog',
  description: 'Administer imported Integrated Management Practices.',
};

/** General IMP catalog layout. */
export default function GeneralImpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
