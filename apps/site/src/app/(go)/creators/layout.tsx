// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Creators', template: '%s | Todd United States' },
};

/**
 * Layout for creators routes in the go subdomain
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The creators subdomain layout
 */
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
