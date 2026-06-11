// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/icon/icon';
import { Portal } from '@/components/common/portal';
import SidebarNavItem from './sidebar-nav-item';
import { SearchModal } from '@/components/common/search-modal/search-modal';

/**
 * Sidebar entry that opens the search modal.
 *
 * Renders a `SidebarNavItem` button (not a link) that toggles the
 * `SearchModal` open, mounted through a `Portal` so it escapes the sidebar's
 * stacking context.
 *
 * @returns The search nav item paired with its portalled modal.
 */
export default function SidebarSearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SidebarNavItem
        icon={<Icon src="/icons/search.svg" className="size-4" />}
        onClick={() => setIsOpen(true)}
      >
        Search
      </SidebarNavItem>
      <Portal>
        <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Portal>
    </>
  );
}
