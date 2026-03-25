// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Farms page metadata */
export const metadata: Metadata = {
  title: 'Farms',
  description:
    'Manage farms, management zones, standard values, and subscriptions.',
};

/**
 * Layout for the farms page.
 * @param children - Page content
 */
export default function FarmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
