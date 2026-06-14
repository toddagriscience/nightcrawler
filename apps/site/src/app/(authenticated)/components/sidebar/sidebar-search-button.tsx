// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { LuSearch } from 'react-icons/lu';
import SidebarNavItem from './sidebar-nav-item';

export default function SidebarSearchButton() {
  return (
    <SidebarNavItem href="/search" icon={<LuSearch className="size-4" />}>
      Search
    </SidebarNavItem>
  );
}
