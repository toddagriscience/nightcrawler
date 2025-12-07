// Copyright Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Generate metadata for investors section
 * @param {Promise<{ locale: string }>} params - The parameters for the function
 * @returns {Promise<Metadata>} - The metadata for the investors section
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: {
      default: 'Todd Investors',
      template: '%s | Todd Investors',
    },
  };
}
/**
 * Layout for investors section
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The investors layout
 */
export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
