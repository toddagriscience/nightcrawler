// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';

/** Layout metadata for CMS-driven marketing forms. */
export const metadata: Metadata = {
  title: { default: 'Form', template: `%s | ${siteConfig.name}` },
  robots: { index: false, follow: false },
};

/**
 * Marketing forms layout shell.
 *
 * @param props - Route children
 */
export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
