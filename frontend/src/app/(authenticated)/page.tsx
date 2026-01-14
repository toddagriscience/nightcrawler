// Copyright © Todd Agriscience, Inc. All rights reserved.

import LogoutButton from '@/components/common/utils/logout-button/logout-button';
import type { Metadata } from 'next';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Home | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users
 * This page is protected by middleware and only accessible to authenticated users
 * Will need to be updated later to show the proper dashboard
 * @returns {React.ReactNode} - The dashboard page component
 */
export default function DashboardPage() {
  return (
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
  );
}
