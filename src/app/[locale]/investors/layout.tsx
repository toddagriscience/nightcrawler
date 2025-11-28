// Copyright Todd LLC, All rights reserved.

import { Metadata } from 'next';

/**
 * Metadata for the Investors page
 */
export const metadata: Metadata = {
  title: 'Todd Investors',
  description:
    "Todd is the world's leading sustainable agriculture firm valued at 40 million dollars in 2025",
};

/**
 * Layout for the Investors section
 * @param {React.ReactNode} children - The children components
 * @returns {React.ReactNode} - The layout component
 */
export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
