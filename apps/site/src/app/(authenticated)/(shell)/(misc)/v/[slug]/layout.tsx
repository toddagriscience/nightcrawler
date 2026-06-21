// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import { getVarietyBySlug } from './utils';

/**
 * Generates metadata for the authenticated variety detail page.
 *
 * @param {Object} props - Dynamic route parameters.
 * @param {Promise<{ slug: string }>} props.params - Variety route params.
 * @returns {Promise<Metadata>} Metadata for the requested variety detail page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const variety = await getVarietyBySlug(slug);

  if (!variety) {
    return createMetadata({
      title: 'Variety',
      description: 'Browse Todd seed variety details and availability.',
      path: `/v/${slug}`,
    });
  }

  return createMetadata({
    title: variety.name,
    description: variety.description ?? undefined,
    path: `/v/${variety.slug}`,
  });
}

/**
 * Layout wrapper for the authenticated variety detail route.
 *
 * @param {Object} props - Layout props.
 * @param {React.ReactNode} props.children - Nested route content.
 * @returns {React.ReactNode} The rendered route children.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
