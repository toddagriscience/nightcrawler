// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { cn } from '@/lib/utils';
import DesktopNav from './desktop-nav';
import { useMenuItems } from './menu-items';
import MobileNav from './mobile-nav';
import { NewHeaderProps } from './types';

/**
 * Marketing site header with full-width click-to-open dropdowns on desktop and a
 * fullscreen sheet overlay on mobile. Resolves menu and auth defaults via
 * `useMenuItems` and delegates layout to `DesktopNav` and `MobileNav`.
 *
 * The header sits at `z-40` so its dropdown content stays above page-level
 * stacking contexts (some marketing pages use `relative z-10` wrappers, which
 * would otherwise paint over the dropdown). Modal surfaces remain at `z-50`
 * and continue to layer above the header.
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
    <header
      className={cn('group relative z-40 w-full overflow-x-clip', className)}
    >
      {/* Glassy blur applied to the page behind the dropdown when a trigger is open. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-20 bottom-0 z-[5] hidden bg-foreground/5 backdrop-blur-md transition-opacity duration-200 group-has-[[data-state=open]]:block"
      />
      <DesktopNav menuItems={menuItems} authLinks={authLinks} />
      <MobileNav menuItems={menuItems} authLinks={authLinks} />
    </header>
  );
}
