// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ReactNode } from 'react';

/**
 * Transparent layout wrapper for `/careers/[slug]` legacy redirects.
 *
 * @param props - Layout children slot
 */
export default function LegacyCareersSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
