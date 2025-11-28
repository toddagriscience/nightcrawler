// Copyright Todd LLC, All rights reserved.

import { Metadata } from 'next';

/**
 * Metadata for the ESG Investors page
 */
export const metadata: Metadata = {
  title: 'ESG | Todd Investors',
  description:
    'Todd is committed to creating and embodying a form of agriculture that heals the planet and society',
};

/**
 * Layout for the ESG Investors section
 * @param {React.ReactNode} children - The children components
 * @returns {React.ReactNode} - The layout component
 */
export default function ESGLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
