// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NavLinks } from '@/components/common/authenticated-header/nav-links';
import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import { Button } from '@/components/ui';
import {
  accountAgreementAcceptance,
  managementZone,
  widget,
  widgetEnum,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { tab } from '@nightcrawler/db/schema/tab';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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

  // Previously: redirected to /welcome when unapproved or when there were no
  // tabs and no zones. Removed for direct platform access; farm.approved still
  // exists for internal approval and ApplicationReviewBanner.
  // if (!currentUser.approved || (currentTabs.length === 0 && managementZones.length === 0)) {
  //   redirect('/welcome');
  // }

  if (currentTabs.length === 0 && managementZones.length === 0) {
    const [hasApplied] = await db
      .select({ userId: accountAgreementAcceptance.userId })
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, currentUser.id))
      .limit(1);

    if (!hasApplied) {
      redirect('/apply');
    }

    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-foreground text-4xl font-thin">
            Your platform is ready when you are
          </h1>
          <p className="text-foreground/75 text-lg font-light">
            There are no management zones or dashboard tabs on this account yet.
            <br />
            You can keep exploring the platform while we finish setting things
            up.
          </p>
          <nav
            aria-label="Explore the platform"
            className="border-foreground/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t pt-8"
          >
            {(
              [
                { href: '/search', label: 'Search knowledge base' },
                { href: '/order', label: 'Orders' },
                { href: '/contact', label: 'Contact' },
                { href: '/account', label: 'Account' },
              ] as const
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground text-sm font-normal underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // This seems redundant - realistically, this will be called once or twice per user.
  if (currentTabs.length === 0 && managementZones.length > 0) {
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
        currentUser.role === 'Admin' ? (
          <AddWidgetDropdown
            managementZoneId={selectedTab.managementZone}
            availableWidgets={availableWidgets}
          >
            <Button
              size="sm"
              variant="default"
              className="h-[34px] w-[96px] hover:cursor-pointer hover:shadow-sm bg-[#D9D9D9]/32 text-foreground border-none focus-visible:ring-transparent! focus-visible:ring-offset-transparent!"
            >
              Add widget
            </Button>
          </AddWidgetDropdown>
        ) : null
      }
    >
      <PlatformTabContent
        currentTabs={currentTabs}
        selectedTabHash={selectedTabHash}
      />
    </PlatformTabs>
  );
}
