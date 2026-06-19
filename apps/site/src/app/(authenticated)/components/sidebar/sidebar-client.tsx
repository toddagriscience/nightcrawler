// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarSheet } from './sidebar-sheet';
import { useSidebarCollapse } from './sidebar-collapse-context';
import SidebarCollapseToggle from './sidebar-collapse-toggle';

/**
 * Authenticated routes that should render without the platform left-rail.
 * These are chrome-less surfaces: the `(bare)` reset-password screen (renders
 * its own minimal Todd-wordmark header) and the pre-platform-access onboarding
 * funnel (apply / welcome / application-success), where platform navigation
 * (Reminders / Orders / Zones) is irrelevant.
 *
 * Note: `/account/agreement` is intentionally absent — it lives in its own
 * `(viewer-agreement)` route group with a separate root layout and no sidebar.
 */
const SIDEBAR_HIDDEN_PATH_PREFIXES = [
  '/account/reset-password',
  '/apply',
  '/welcome',
  '/application-success',
] as const;

/**
 * Whether the platform sidebar should be hidden for a given pathname.
 *
 * @param {string} pathname - The current path (no `[locale]` segment on
 *   authenticated routes), e.g. `/account/reset-password` or `/order`.
 * @returns {boolean} - True when the path is a chrome-less route that should
 *   not show the sidebar.
 */
export function isSidebarHiddenForPath(pathname: string): boolean {
  return SIDEBAR_HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

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
  const pathname = usePathname();
  const { collapsed } = useSidebarCollapse();

  if (isSidebarHiddenForPath(pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop: width-animated collapsing panel + expand button when closed */}
      <div className="hidden md:flex">
        <div
          className={`h-screen overflow-hidden transition-[width] duration-300 ease-in-out ${
            collapsed ? 'w-0' : 'w-[280px]'
          }`}
        >
          {children}
        </div>
        {collapsed ? (
          <div className="flex h-screen flex-col items-center border-r border-[#D9D9D9]/30 px-2 pt-2">
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
