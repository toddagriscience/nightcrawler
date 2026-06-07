// Copyright © Todd Agriscience, Inc. All rights reserved.

import Sidebar from './sidebar';
import { SidebarSheet } from './sidebar-sheet';

/**
 * Responsive sidebar wrapper — server component.
 * Desktop: renders full sidebar directly.
 * Mobile: wraps sidebar in a Sheet overlay triggered by hamburger icon.
 */
export default function SidebarClient() {
  return (
    <>
      {/* Desktop: full sidebar, always visible */}
      <div className="hidden md:flex w-[280px] shrink-0 flex-col h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile: hamburger + sheet overlay */}
      <div className="flex md:hidden">
        <SidebarSheet>
          <Sidebar />
        </SidebarSheet>
      </div>
    </>
  );
}
