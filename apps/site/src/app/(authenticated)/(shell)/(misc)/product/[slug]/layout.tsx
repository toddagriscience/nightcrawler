// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import { getSeedProductBySlug } from './utils';

/**
 * Generates metadata for the authenticated seed product detail page.
 *
 * @param {Object} props - Dynamic route parameters.
 * @param {Promise<{ slug: string }>} props.params - Product route params.
 * @returns {Promise<Metadata>} Metadata for the requested product detail page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSeedProductBySlug(slug);

  if (!product) {
    return createMetadata({
      title: 'Seed Product',
      description: 'Browse Todd seed product details and ordering information.',
      path: `/product/${slug}`,
    });
  }

  return createMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    ogImage: product.imageUrl ?? undefined,
  });
}

/**
 * Layout wrapper for the authenticated seed product detail route.
 *
 * @param {Object} props - Layout props.
 * @param {React.ReactNode} props.children - Nested route content.
 * @returns {React.ReactNode} The rendered route children.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
