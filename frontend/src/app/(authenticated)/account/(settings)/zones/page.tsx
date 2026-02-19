// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Metadata for the zones page
 */
export const metadata: Metadata = {
  title: 'Zones',
};

/**
 * Zones page — displays management zone configuration for the account.
 * @returns {React.ReactNode} - The zones page component
 */
export default function ZonesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Zones</h1>
      </header>
    </div>
  );
}
