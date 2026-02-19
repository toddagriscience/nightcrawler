// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Metadata for the farm information page
 */
export const metadata: Metadata = {
  title: 'Farm Information',
};

/**
 * Farm Information page — displays farm-related account details.
 * @returns {React.ReactNode} - The farm information page component
 */
export default function FarmPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">
          Farm Information
        </h1>
      </header>
    </div>
  );
}
