// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NavLinks } from '@/components/common/authenticated-header/nav-links';
import { managementZone } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAccountShellData } from '../(accounts)/account/db';
import ZoneTemplate from './components/zone-template';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Home | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users.
 * Shows a left sidebar listing all management zones and the selected zone's
 * template (info, mineral IMPs, observations, search).
 *
 * @returns {React.ReactNode} - The dashboard page component
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getAuthenticatedInfo();
  const { farmName } = await getAccountShellData();

  // Fetch ALL management zones for the farm (oldest first)
  const allManagementZones = await db
    .select()
    .from(managementZone)
    .where(eq(managementZone.farmId, currentUser.farmId))
    .orderBy(asc(managementZone.createdAt));

  // No zones at all — show empty state for onboarded farms without zones yet
  if (allManagementZones.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-foreground text-4xl font-thin">
            Your platform is ready when you are
          </h1>
          <p className="text-foreground/75 text-lg font-light">
            There are no management zones on this account yet.
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

  return (
    <div className="flex h-screen flex-col">
      <header
        className="flex w-full items-center justify-between px-3 pt-3 pb-2"
        role="banner"
      >
        <h1 className="text-foreground truncate text-lg font-medium">
          {farmName}
        </h1>
        <div className="flex flex-row items-center gap-6">
          <NavLinks />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <ZoneTemplate
            zoneId={selectedZone.id}
            zoneName={selectedZone.name ?? 'Unnamed zone'}
          />
        </main>
      </div>
    </div>
  );
}
