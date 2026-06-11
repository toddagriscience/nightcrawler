// Copyright © Todd Agriscience, Inc. All rights reserved.

import { OrderNavLink } from '@/components/common/authenticated-header/components/order-nav-link';
import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import { Button } from '@/components/ui';
import {
  accountAgreementAcceptance,
  managementZone,
  widget,
  widgetEnum,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAccountShellData } from '../(accounts)/account/db';
import CurrentTab from '../components/tabs/current-tab';
import { NamedTab } from '../components/tabs/types';

// -- Commented out: tab-based imports (kept for future use) ---
//import PlatformTabContent from '../components/tabs/tab-content';
//import PlatformTabs from '../components/tabs/tabs';
//import { getTablessManagementZones } from '../components/tabs/utils';
//import { getSelectedTab, getSelectedTabHash } from './utils';
//import { tab } from '@nightcrawler/db/schema/tab';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Home | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users.
 * Shows a left sidebar listing all management zones and the selected zone's content.
 *
 * @returns {React.ReactNode} - The dashboard page component
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getAuthenticatedInfo();
  const canEdit = currentUser.role === 'Admin';
  const { farmName } = await getAccountShellData();

  // Fetch ALL management zones for the farm (oldest first)
  const allManagementZones = await db
    .select()
    .from(managementZone)
    .where(eq(managementZone.farmId, currentUser.farmId))
    .orderBy(asc(managementZone.createdAt));

  // No zones at all — check if user has applied, or show empty state
  if (allManagementZones.length === 0) {
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

  // Determine selected zone from URL param, default to first zone
  const params = await searchParams;
  const zoneParam = typeof params.zone === 'string' ? params.zone : undefined;
  const selectedZone =
    allManagementZones.find((z) => String(z.id) === zoneParam) ||
    allManagementZones[0];

  // Build a NamedTab-compatible object for CurrentTab (it expects this shape)
  const selectedTab: NamedTab = {
    id: selectedZone.id,
    user: currentUser.id,
    managementZone: selectedZone.id,
    name: selectedZone.name,
  };

  // Fetch widgets for the selected zone (for the Add Widget dropdown)
  const widgets = await db
    .select()
    .from(widget)
    .where(eq(widget.managementZone, selectedZone.id));
  const allWidgetTypes = widgetEnum.enumValues;
  const existingWidgetNames = new Set(widgets.map((w) => w.name));
  const availableWidgets = allWidgetTypes.filter(
    (widgetType) => !existingWidgetNames.has(widgetType)
  );

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Header — full width, same as before */}
      <header
        className="flex w-full items-center justify-between px-3 pt-3 pb-2"
        role="banner"
      >
        <h1 className="text-foreground truncate text-lg font-medium">
          {farmName}
        </h1>
        <div className="flex flex-row items-center gap-6">
          <OrderNavLink />
        </div>
      </header>

      {/* Body — content */}
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-auto">
            <CurrentTab currentTab={selectedTab} />
          </div>
          {canEdit ? (
            <div className="absolute bottom-4 right-4 z-10">
              <AddWidgetDropdown
                managementZoneId={selectedZone.id}
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
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
