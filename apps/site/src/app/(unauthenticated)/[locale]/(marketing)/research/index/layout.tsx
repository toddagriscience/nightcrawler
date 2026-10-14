// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createLocalizedMetadata } from '@/lib/metadata';

import { Metadata } from 'next';

const pageMetadata: Metadata = {
  title: 'Research',
  description: 'Research and product release news from Todd Agriscience, Inc.',
};

/** Metadata URLs for the route's actual language and final public path. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(pageMetadata, '/research/index', locale);
}

/**
 * Layout for the research & product-release listing page.
 *
 * @param props - Layout props
 * @param props.children - Nested page content
 * @returns {JSX.Element} The wrapped page
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
