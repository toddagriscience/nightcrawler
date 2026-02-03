// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { managementZone } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { tab } from '@/lib/db/schema/tab';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { asc, eq } from 'drizzle-orm';
import { Tab } from './components/tabs/types';
import RenderedTabs from './components/tabs/rendered-tabs';

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
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
        <h1>There was an error with authentication</h1>
        <p>{currentUser.error}</p>
      </div>
    );
  }

  const currentTabs: Tab[] = await db
    .select({
      id: tab.id,
      managementZone: tab.managementZone,
      name: managementZone.name,
    })
    .from(tab)
    .innerJoin(managementZone, eq(managementZone.id, tab.managementZone))
    .orderBy(asc(managementZone.name))
    .where(eq(tab.user, currentUser.id));

  return <RenderedTabs currentTabs={currentTabs} />;
}
