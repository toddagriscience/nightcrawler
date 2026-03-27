// Copyright © Todd Agriscience, Inc. All rights reserved.

import sanityQuery from '@/lib/sanity/query';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // This should be cached from `page.tsx` (metadata is rendered after RSC)
  const article = await sanityQuery(
    'news',
    await params,
    {
      next: { revalidate: 60 * 60 },
    },
    0
  );

  return {
    title: { default: article.title, template: '%s | Todd United States' },
    description: article.summary,
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
