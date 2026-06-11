// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Icon } from '@/components/common/icon/icon';
import SidebarNavItem from './sidebar-nav-item';

export default function SidebarSearchButton() {
  return (
    <SidebarNavItem
      href="/search"
      icon={<Icon src="/icons/search.svg" className="size-4" />}
    >
      Search
    </SidebarNavItem>
  );
}
