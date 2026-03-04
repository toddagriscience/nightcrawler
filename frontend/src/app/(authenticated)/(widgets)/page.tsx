// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NavLinks } from '@/components/common/authenticated-header/nav-links';
import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import { Button } from '@/components/ui';
import { managementZone, widget, widgetEnum } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { tab } from '@/lib/db/schema/tab';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { BiPlus } from 'react-icons/bi';
import PlatformTabContent from '../components/tabs/tab-content';
import PlatformTabs from '../components/tabs/tabs';
import { getTablessManagementZones } from '../components/tabs/utils';
import { getSelectedTab, getSelectedTabHash } from './utils';

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
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getAuthenticatedInfo();

  const fetchCurrentTabs = async () =>
    db
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

  let currentTabs = await fetchCurrentTabs();

  let managementZones = await getTablessManagementZones(currentUser.farmId);

  // This seems redundant - realistically, this will be called once or twice per user.
  if (
    currentUser.approved &&
    currentTabs.length === 0 &&
    managementZones.length > 0
  ) {
    await db.insert(tab).values({
      managementZone: managementZones[0].id,
      user: currentUser.id,
    });

    currentTabs = await fetchCurrentTabs();
    managementZones = await getTablessManagementZones(currentUser.farmId);
  }

  const selectedTabHash = await getSelectedTabHash(searchParams, currentTabs);
  const selectedTab = await getSelectedTab(selectedTabHash, currentTabs);

  const widgets = await db
    .select()
    .from(widget)
    .where(eq(widget.managementZone, selectedTab.managementZone));
  const allWidgetTypes = widgetEnum.enumValues;
  const existingWidgetNames = new Set(widgets.map((w) => w.name));
  const availableWidgets = allWidgetTypes.filter(
    (widgetType) => !existingWidgetNames.has(widgetType)
  );

  return (
    <PlatformTabs
      managementZones={managementZones}
      currentTabs={currentTabs}
      currentUser={currentUser}
      selectedTabHash={selectedTabHash}
      header={
        <div className="flex items-center gap-4">
          <NavLinks />
        </div>
      }
      addWidgetDropdown={
        <AddWidgetDropdown
          managementZoneId={selectedTab.managementZone}
          availableWidgets={availableWidgets}
        >
          <Button
            size="sm"
            variant="default"
            className="hover:cursor-pointer bg-[#D9D9D9]/32 text-foreground hover:shadow-sm border-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:ring-transparent! focus-visible:ring-offset-transparent!"
          >
            Add Widget
            <BiPlus className="size-4 text-foreground/80" />
          </Button>
        </AddWidgetDropdown>
      }
    >
      <PlatformTabContent
        currentTabs={currentTabs}
        currentUser={currentUser}
        selectedTabHash={selectedTabHash}
      />
    </PlatformTabs>
  );
}
