// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { LuSearch } from 'react-icons/lu';
import SidebarNavItem from './sidebar-nav-item';
import { useSearchPanel } from '../search-panel/search-panel-context';

/**
 * Sidebar entry that toggles the right-side search panel.
 *
 * Renders a `SidebarNavItem` button (not a link) wired to the shell-level
 * search panel state, so opening search pushes the page content aside rather
 * than covering it.
 *
 * @returns The search nav item rendered as a button.
 */
export default function SidebarSearchButton() {
  const { toggle } = useSearchPanel();

  return (
    <SidebarNavItem icon={<LuSearch className="size-4" />} onClick={toggle}>
      Search
    </SidebarNavItem>
  );
}
