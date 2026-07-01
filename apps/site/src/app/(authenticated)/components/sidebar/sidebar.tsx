// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarSectionLabel from './sidebar-section-label';
import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import SidebarSearchButton from './sidebar-search-button';
import SidebarCollapseToggle from './sidebar-collapse-toggle';
import ZoneItem from './zone-item';
import {
  getAccountShellData,
  getManagementZones,
} from '@/app/(authenticated)/(shell)/(accounts)/account/db';
import { LuBell, LuShoppingCart } from 'react-icons/lu';

/**
 * Authenticated sidebar — collapse control, primary nav links, the read-only
 * management-zones list, and the account footer.
 *
 * @returns {React.ReactNode} - The sidebar navigation
 */
export default async function Sidebar() {
  const [zones, { farmName }] = await Promise.all([
    getManagementZones(),
    getAccountShellData(),
  ]);

  return (
    <aside className="w-[280px] shrink-0 border-r border-[#D9D9D9]/30 bg-[var(--background)] flex flex-col h-screen overflow-y-auto">
      {/* Farm name + collapse control — title aligns with the nav item labels
          (empty icon-sized spacer mirrors SidebarNavItem's icon + gap). */}
      <div className="flex items-center justify-between gap-2 px-3 pt-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
          <span className="size-4 shrink-0" aria-hidden="true" />
          <span className="text-foreground truncate text-sm font-medium">
            {farmName}
          </span>
        </div>
        <SidebarCollapseToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
        {/* Top actions */}
        <SidebarSearchButton />
        <SidebarNavItem href="/reminders" icon={<LuBell className="size-4" />}>
          Reminders
        </SidebarNavItem>
        <SidebarNavItem
          href="/order"
          icon={<LuShoppingCart className="size-4" />}
        >
          Orders
        </SidebarNavItem>

        {/* Management zones (read-only list) */}
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
      </nav>

      {/* Account footer */}
      <SidebarUserFooter />
    </aside>
  );
}
