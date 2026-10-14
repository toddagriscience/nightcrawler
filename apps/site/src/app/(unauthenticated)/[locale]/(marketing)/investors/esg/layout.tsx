// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createLocalizedMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

/** Final URLs for the translated ESG page. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata({}, '/investors/esg', locale);
}

/** Keeps the investor layout around the ESG page. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
