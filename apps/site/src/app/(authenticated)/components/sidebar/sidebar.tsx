// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import SidebarSectionLabel from './sidebar-section-label';
import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import { Icon } from '@/components/common/icon/icon';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { getManagementZones } from '@/app/(authenticated)/(accounts)/account/db';
import SidebarSearchButton from './sidebar-search-button';
import NewZoneButton from './new-zone-button';
import ZoneItem from './zone-item';

export default async function Sidebar() {
  const user = await getAuthenticatedInfo();
  const zones = await getManagementZones();

  return (
    <aside className="w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--background)] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[var(--border)]">
        <Link
          href="/"
          className="text-foreground font-bold text-base tracking-wide wordmark"
        >
          TODD
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
        {/* Top actions */}
        <SidebarSearchButton />
        <SidebarNavItem
          href="/reminders"
          icon={<Icon src="/icons/bell.svg" className="size-4" />}
        >
          Reminders
        </SidebarNavItem>
        <SidebarNavItem
          href="/order"
          icon={<Icon src="/icons/shopping-cart.svg" className="size-4" />}
        >
          Orders
        </SidebarNavItem>
        <SidebarNavItem
          href="/account"
          icon={<Icon src="/icons/settings.svg" className="size-4" />}
        >
          Account
        </SidebarNavItem>

        {/* Management zones */}
        {zones.length > 0 && (
          <>
            <SidebarSectionLabel>Zones</SidebarSectionLabel>
            {zones.map((zone) => (
              <ZoneItem key={zone.id} id={zone.id} name={zone.name ?? ''} />
            ))}
          </>
        )}

        {/* New zone button */}
        <div className="mt-2">
          <NewZoneButton />
        </div>
      </nav>

      {/* User footer */}
      <SidebarUserFooter email={user.email} />
    </aside>
  );
}
