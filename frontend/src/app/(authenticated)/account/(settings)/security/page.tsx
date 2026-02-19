// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Metadata for the security page
 */
export const metadata: Metadata = {
  title: 'Security',
};

/**
 * Security page — account security settings such as password management.
 * @returns {React.ReactNode} - The security page component
 */
export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Security</h1>
      </header>
    </div>
  );
}
