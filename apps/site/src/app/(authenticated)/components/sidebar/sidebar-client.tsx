// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import type { ReactNode } from 'react';
import { SidebarSheet } from './sidebar-sheet';
import { useSidebarCollapse } from './sidebar-collapse-context';
import SidebarCollapseToggle from './sidebar-collapse-toggle';

interface SidebarClientProps {
  /** The server-rendered <Sidebar /> tree, passed in so it stays a server component. */
  children: ReactNode;
}

/**
 * Responsive sidebar wrapper — client component.
 * Desktop: a width-animated panel that slides between full and zero width; a
 * small expand button appears once the panel is collapsed.
 * Mobile: wraps the sidebar in a Sheet overlay triggered by a hamburger icon.
 *
 * @param {ReactNode} children - The server-rendered sidebar contents
 * @returns {React.ReactNode} - The responsive sidebar wrapper
 */
export default function SidebarClient({ children }: SidebarClientProps) {
  const { collapsed } = useSidebarCollapse();

  return (
    <>
      {/* Desktop: width-animated collapsing panel + expand button when closed */}
      <div className="hidden md:flex">
        <div
          className={`overflow-hidden transition-[width] duration-300 ease-in-out ${
            collapsed ? 'w-0' : 'w-[280px]'
          }`}
        >
          {children}
        </div>
        {collapsed ? (
          <div className="sticky top-0 flex h-screen flex-col items-center border-r border-[#D9D9D9]/30 px-2 pt-2">
            <SidebarCollapseToggle />
          </div>
        ) : null}
      </div>

      {/* Mobile: hamburger + sheet overlay */}
      <div className="flex md:hidden">
        <SidebarSheet>{children}</SidebarSheet>
      </div>
    </>
  );
}
