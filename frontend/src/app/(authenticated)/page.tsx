// Copyright © Todd Agriscience, Inc. All rights reserved.

import { accountAgreementAcceptance } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
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
  try {
    const currentUser = await getAuthenticatedInfo();

    const [hasApplied] = await db
      .select({ userId: accountAgreementAcceptance.userId })
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, currentUser.id))
      .limit(1);

    return (
      <div className="flex flex-col items-center justify-between min-h-[calc(100vh-8rem)] px-4">
        <div></div>
        <div className="text-center space-y-4">
          <h1 className="text-foreground text-3xl font-bold">Welcome</h1>
          <p className="text-foreground text-base font-normal">
            Thank you for being a Todd client since 2025
          </p>
          {hasApplied ? (
            <p>
              We&apos;ll take a look at your application as soon as possible.
            </p>
          ) : (
            <ApplyButton />
          )}
        </div>
        <Link
          href="/contact"
          className="text-foreground text-base font-normal underline hover:opacity-70 transition-opacity inline-block mt-4"
        >
          Experiencing an Issue?
        </Link>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
