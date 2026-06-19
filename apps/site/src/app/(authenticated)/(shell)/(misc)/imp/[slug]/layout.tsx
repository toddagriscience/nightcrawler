// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';
import { getImpArticleBySlug } from './utils';
import { createMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getImpArticleBySlug(slug);

  if (!article) {
    return createMetadata({
      title: 'IMP',
      description: 'Integrated Management Plans | Todd',
      path: `/imp/${slug}`,
    });
  }

  return createMetadata({
    title: article.title + ' | Todd',
    description: article.content.replace(/[#*_`>\[\]\(\)]/g, '').slice(0, 160),
    path: `/imp/${article.slug}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
