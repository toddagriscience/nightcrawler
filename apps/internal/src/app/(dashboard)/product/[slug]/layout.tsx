// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Product detail page metadata */
export const metadata: Metadata = {
  title: 'Product Details',
  description: 'View detailed seed product information and trend graphs.',
};

/**
 * Layout for the product detail page.
 * @param children - Page content
 */
export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
