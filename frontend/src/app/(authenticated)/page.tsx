// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import type { Metadata } from 'next';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { Button } from '@/components/ui';
import ApplyButton from './components/apply-button';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Home | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users
 * This page is protected by middleware and only accessible to authenticated users
 * @returns {React.ReactNode} - The dashboard page component
 */
export default async function DashboardPage() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser) {
    return (
      <div>
        <p>{currentUser.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="text-center space-y-4">
        {currentUser.approved ? (
          <>
            <p className="text-foreground text-base font-normal">Today</p>
            <h1 className="text-foreground text-3xl font-bold">Welcome</h1>
            <p className="text-foreground text-base font-normal">
              Thank you for being a Todd client since 2025
            </p>
            <Link
              href="/contact"
              className="text-foreground text-base font-normal underline hover:opacity-70 transition-opacity inline-block mt-4"
            >
              Experiencing an Issue?
            </Link>
          </>
        ) : (
          <ApplyButton />
        )}
      </div>
    </div>
  );
}
