// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'J Fellows',
  description:
    'A ten-person mentorship fellowship for young founders, run with the Todd Founder Program. Applications for the first cohort are open.',
  openGraph: {
    title: 'J Fellows',
    description:
      'A ten-person mentorship fellowship for young founders, run with the Todd Founder Program. Applications for the first cohort are open.',
    type: 'website',
  },
};

/**
 * Root layout for the J Fellows statement page.
 *
 * Deliberately bare: no header, footer, or smooth-scroll wrapper, because the
 * page is a single full-height statement and anything else would crowd it.
 *
 * @param children - Page content
 */
export default function JFellowsLayout({
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
