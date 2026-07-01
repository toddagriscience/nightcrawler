// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarSectionLabel from './sidebar-section-label';
import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import SidebarSearchButton from './sidebar-search-button';
import SidebarCollapseToggle from './sidebar-collapse-toggle';
import ZoneItem from './zone-item';
import ZoneKeyboardNav from './zone-keyboard-nav';
import {
  getAccountShellData,
  getManagementZones,
} from '@/app/(authenticated)/(shell)/(accounts)/account/db';
import { BiTimeFive } from 'react-icons/bi';

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
    <aside className="bg-[var(--background)] flex h-screen w-[280px] shrink-0 flex-col overflow-y-auto border-r border-[#D9D9D9]/30">
      {/* Farm name + collapse control — title's left edge aligns with the nav
          item icons (row px-3 + inner px-3, matching SidebarNavItem's px-3). */}
      <div className="flex items-center justify-between gap-2 px-3 pt-2">
        <span className="text-foreground min-w-0 flex-1 truncate px-3 text-sm font-medium">
          {farmName}
        </span>
        <SidebarCollapseToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
        {/* Top actions */}
        <SidebarSearchButton />
        <SidebarNavItem
          href="/reminders"
          icon={<BiTimeFive className="size-4" />}
        >
          Reminders
        </SidebarNavItem>

        {/* Management zones (read-only list) */}
        {zones.length > 0 && (
          <>
            <SidebarSectionLabel>Management Zones</SidebarSectionLabel>
            <ZoneKeyboardNav zoneIds={zones.map((zone) => zone.id)} />
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
