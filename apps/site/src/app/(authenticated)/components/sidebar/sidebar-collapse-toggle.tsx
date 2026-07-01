// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { BiDockLeft, BiDockRight } from 'react-icons/bi';
import { useSidebarCollapse } from './sidebar-collapse-context';

/**
 * Header button that collapses or expands the global left sidebar.
 *
 * @returns {React.ReactNode} - The collapse toggle button
 */
export default function SidebarCollapseToggle() {
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-pressed={collapsed}
      className="flex size-8 shrink-0 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-[#D9D9D9]/20 hover:text-foreground"
    >
      {collapsed ? (
        <BiDockRight className="size-5" />
      ) : (
        <BiDockLeft className="size-5" />
      )}
    </button>
  );
}
