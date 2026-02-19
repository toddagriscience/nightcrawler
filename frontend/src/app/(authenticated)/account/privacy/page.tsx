// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Metadata for the privacy page
 */
export const metadata: Metadata = {
  title: 'Privacy',
};

/**
 * Privacy page — privacy preferences and data management settings.
 * @returns {React.ReactNode} - The privacy page component
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Privacy</h1>
      </header>
    </div>
  );
}
