// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Offer letters page metadata */
export const metadata: Metadata = {
  title: 'Offer Letters',
  description: 'Generate PDF offer letters for new hires.',
};

/**
 * Layout for the offer letters page.
 * @param children - Page content
 */
export default function OfferLettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
