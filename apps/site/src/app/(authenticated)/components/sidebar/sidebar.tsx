// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarSectionLabel from './sidebar-section-label';
import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import { Icon } from '@/components/common/icon/icon';
import { getManagementZones } from '@/app/(authenticated)/(accounts)/account/db';
import SidebarSearchButton from './sidebar-search-button';
import NewZoneButton from './new-zone-button';
import ZoneItem from './zone-item';
import SidebarCollapseToggle from './sidebar-collapse-toggle';

export default async function Sidebar() {
  const zones = await getManagementZones();

  return (
    <aside className="w-[280px] shrink-0 border-r border-[#D9D9D9]/30 bg-[var(--background)] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Collapse control */}
      <div className="flex items-center justify-end px-2 pt-2">
        <SidebarCollapseToggle />
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

        {/* Management zones */}
        {zones.length > 0 && (
          <>
            <SidebarSectionLabel>Management Zones</SidebarSectionLabel>
            {zones.map((zone, index) => (
              <ZoneItem
                key={zone.id}
                index={index}
                id={zone.id}
                name={zone.name ?? ''}
              />
            ))}
          </>
        )}

        {/* New zone button */}
        <div className="mt-2">
          <NewZoneButton />
        </div>
      </nav>

      {/* Account footer */}
      <SidebarUserFooter />
    </aside>
  );
}
