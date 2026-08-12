// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Ten Rising Stars',
  description:
    'Ten a year, developed hard, with the Todd Founder Program. Cohort one is open.',
  openGraph: {
    title: 'Ten Rising Stars',
    description:
      'Ten a year, developed hard, with the Todd Founder Program. Cohort one is open.',
    type: 'website',
  },
};

/**
 * Root layout for the Ten Rising Stars statement page.
 *
 * Deliberately bare: no header, footer, or smooth-scroll wrapper, because the
 * page is a single full-height statement and anything else would crowd it.
 *
 * @param children - Page content
 */
export default function TenRisingStarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fontVariables} bg-white`}>{children}</body>
    </html>
  );
}
