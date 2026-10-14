// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Private contact page metadata. */
export const metadata: Metadata = {
  title: 'Contact your advisor | Todd',
  robots: { index: false, follow: false },
};

/** Contact page metadata boundary within the existing authenticated shell. */
export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
