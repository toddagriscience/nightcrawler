// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/icon/icon';
import { Portal } from '@/components/common/portal';
import SidebarNavItem from './sidebar-nav-item';
import { SearchModal } from '@/components/common/search-modal/search-modal';

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
