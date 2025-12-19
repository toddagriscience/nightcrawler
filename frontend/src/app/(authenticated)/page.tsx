// Copyright © Todd Agriscience, Inc. All rights reserved.

import LogoutButton from '@/components/common/utils/logout-button/logout-button';
import type { Metadata } from 'next';
import { Suspense } from 'react';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Dashboard | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users
 * This page is protected by middleware and only accessible to authenticated users
 * Will need to be updated later to show the proper dashboard
 * @returns {React.ReactNode} - The dashboard page component
 */
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // delete
  return (
    <div className="bg-background min-h-screen">
      {/* // delete */}
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Dashboard
            </h1>
          </header>
          <div className="text-muted-foreground text-sm">Coming soon...</div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

// delete
async function DashboardContent() {
  await new Promise((r) => setTimeout(r, 3000));
  return <div>Coming soon...</div>;
}
