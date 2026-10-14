// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createLocalizedMetadata } from '@/lib/metadata';

import { Metadata } from 'next';

const pageMetadata: Metadata = {
  title: 'About',
};

/** Metadata URLs for the route's actual language and final public path. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(pageMetadata, '/about', locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
