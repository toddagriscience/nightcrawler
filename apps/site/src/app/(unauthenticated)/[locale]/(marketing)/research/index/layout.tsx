// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research and product release news from Todd Agriscience, Inc.',
};

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
