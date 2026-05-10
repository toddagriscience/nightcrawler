// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { cn } from '@/lib/utils';
import DesktopNav from './desktop-nav';
import { useMenuItems } from './menu-items';
import MobileNav from './mobile-nav';
import { NewHeaderProps } from './types';

/**
 * Marketing site header with full-width hover dropdowns on desktop and a
 * fullscreen sheet overlay on mobile. Resolves menu and auth defaults via
 * `useMenuItems` and delegates layout to `DesktopNav` and `MobileNav`.
 *
 * @param props - Optional menu items and auth links to override defaults.
 * @returns The redesigned marketing header.
 */
export default function NewHeader({
  menu,
  auth,
  className,
}: NewHeaderProps): React.ReactNode {
  const { menuItems, authLinks } = useMenuItems({ menu, auth });

  return (
    <header className={cn('group relative w-full overflow-x-clip', className)}>
      {/* Glassy blur applied to the page behind the dropdown when a trigger is open. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-32 bottom-0 z-[5] hidden bg-foreground/5 backdrop-blur-md transition-opacity duration-200 group-has-[[data-state=open]]:block"
      />
      <DesktopNav menuItems={menuItems} authLinks={authLinks} />
      <MobileNav menuItems={menuItems} authLinks={authLinks} />
    </header>
  );
}
