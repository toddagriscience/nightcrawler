// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import SidebarSearchButton from './sidebar-search-button';
import SidebarCollapseToggle from './sidebar-collapse-toggle';
import { LuBell, LuShoppingCart } from 'react-icons/lu';

/**
 * Authenticated sidebar — brand-area collapse control, primary nav links, and
 * the account footer.
 *
 * @returns {React.ReactNode} - The sidebar navigation
 */
export default function Sidebar() {
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
        <SidebarNavItem href="/reminders" icon={<LuBell className="size-4" />}>
          Reminders
        </SidebarNavItem>
        <SidebarNavItem
          href="/order"
          icon={<LuShoppingCart className="size-4" />}
        >
          Orders
        </SidebarNavItem>
      </nav>

      {/* Account footer */}
      <SidebarUserFooter />
    </aside>
  );
}
