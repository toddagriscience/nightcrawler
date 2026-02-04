// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { managementZone } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { tab } from '@/lib/db/schema/tab';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { and, asc, eq, exists, ne, notExists } from 'drizzle-orm';
import { NamedTab } from './components/tabs/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Landing from './components/landing';
import { getTabHash } from './components/tabs/helpers';
import PlatformTabsList from './components/tabs/tabs-list';
import { ManagementZoneSelect } from '@/lib/types/db';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Home | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users. Every page here inside a tab (usually only management zones).
 *
   Scaling is a little bit scuffed here. We're taking a div and shoving it into `AuthenticatedHeader` manually, then scaling it accordingly with variables #'s of tabs. This technically works with up to 25 tabs on the smallest screen size. This is fine because the user will be limited to a maximum of 8 tabs.
 *
 * This page is protected by middleware and only accessible to authenticated users
 * @returns {React.ReactNode} - The dashboard page component
 */
export default async function DashboardPage() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser || !currentUser.farmId) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-[90vw] max-w-[500px] flex-col items-center justify-center">
        <h1>There was an error with authentication</h1>
        <p>
          {'error' in currentUser
            ? currentUser.error
            : 'An id for your farm was not provided'}
        </p>
      </div>
    );
  }

  const currentTabs: NamedTab[] = await db
    .select({
      id: tab.id,
      managementZone: tab.managementZone,
      name: managementZone.name,
      user: tab.user,
    })
    .from(tab)
    .innerJoin(managementZone, eq(managementZone.id, tab.managementZone))
    .orderBy(asc(managementZone.name))
    .where(eq(tab.user, currentUser.id));

  const managementZones = await db
    .select({ managementZone })
    .from(managementZone)
    .where(
      and(
        eq(managementZone.farmId, currentUser.farmId),
        notExists(
          db
            .select({ id: tab.id })
            .from(tab)
            .where(eq(managementZone.id, tab.managementZone))
        )
      )
    );

  // The following bit is a bit sloppy, couldn't figure out querying. It'll do for now though, most farms won't have more than 10 zones.
  const flattenedManagementZones: ManagementZoneSelect[] = managementZones.map(
    (row) => row.managementZone
  );

  return (
    <Tabs
      defaultValue={
        currentTabs.length !== 0 ? getTabHash(currentTabs[0]) : 'home'
      }
    >
      <PlatformTabsList
        currentTabs={currentTabs}
        managementZones={flattenedManagementZones}
        currentUser={currentUser}
      />
      {!currentTabs.length ? (
        <TabsContent value="home">
          <Landing />
        </TabsContent>
      ) : (
        currentTabs.map((tab) => (
          <TabsContent key={tab.id} value={getTabHash(tab)}>
            <h1>{tab.name}</h1>
          </TabsContent>
        ))
      )}
    </Tabs>
  );
}
