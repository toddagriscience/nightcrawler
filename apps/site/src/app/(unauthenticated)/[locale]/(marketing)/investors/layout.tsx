// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createPublicPageMetadata } from '@/lib/public-page-metadata';
import type { Metadata } from 'next';

/** Complete translated metadata for the final public page URL. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPublicPageMetadata('investors', locale);
}

/** Preserves the page's presentation around its children. */
export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
