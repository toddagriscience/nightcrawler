// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Seed products page metadata */
export const metadata: Metadata = {
  title: 'Seed Products',
  description: 'Manage seed products on the Todd platform.',
};

/**
 * Layout for the seed products page.
 * @param children - Page content
 */
export default function SeedProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
