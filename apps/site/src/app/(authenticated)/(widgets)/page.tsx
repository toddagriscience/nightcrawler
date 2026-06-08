// Copyright © Todd Agriscience, Inc. All rights reserved.

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
      <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-foreground text-4xl font-extralight tracking-tight">
            Your platform is ready when you are
          </h1>
          <p className="text-muted-foreground text-base font-light leading-relaxed">
            There are no management zones or dashboard tabs on this account yet.
            <br />
            You can keep exploring the platform while we finish setting things
            up.
          </p>
          <nav
            aria-label="Explore the platform"
            className="border-border/20 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t pt-8"
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
                className="text-foreground/70 text-sm font-normal underline underline-offset-4 transition-opacity hover:text-foreground hover:opacity-100"
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
    <div className="relative flex h-screen flex-col bg-background-platform">
      {/* Floating add widget button */}
      {canEdit ? (
        <div className="fixed bottom-6 right-6 z-10">
          <AddWidgetDropdown
            managementZoneId={selectedZone.id}
            availableWidgets={availableWidgets}
          >
            <Button
              size="sm"
              variant="default"
              className="h-8 px-4 text-xs font-medium tracking-wide text-foreground/80 bg-muted/40 hover:bg-muted/60 border border-border/20 hover:border-border/40 hover:shadow-sm transition-all duration-150 focus-visible:ring-transparent focus-visible:ring-offset-transparent"
            >
              Add widget
            </Button>
          </AddWidgetDropdown>
        </div>
      ) : null}

      {/* Body — content only */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <CurrentTab currentTab={selectedTab} />
        </main>
      </div>
    </div>
  );
}
