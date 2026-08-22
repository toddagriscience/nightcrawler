// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { LuSearch } from 'react-icons/lu';
import SidebarNavItem from './sidebar-nav-item';
import { useSearchPanel } from '../search-panel/search-panel-context';

/**
 * Sidebar entry that opens the command-palette search popup.
 *
 * @returns The search nav item rendered as a button.
 */
export default function SidebarSearchButton() {
  const { openModal } = useSearchPanel();

  return (
    <SidebarNavItem icon={<LuSearch className="size-4" />} onClick={openModal}>
      Search
    </SidebarNavItem>
  );
}
