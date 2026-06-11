// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarNavItem from './sidebar-nav-item';
import { Icon } from '@/components/common/icon/icon';

/**
 * Sidebar footer — renders the Account navigation entry pinned to the bottom
 * of the sidebar.
 *
 * @returns {React.ReactNode} - The sidebar account footer
 */
export default function SidebarUserFooter() {
  return (
    <div className="border-t border-[#D9D9D9]/30 px-3 py-3">
      <SidebarNavItem
        href="/account"
        prefixMatch
        icon={<Icon src="/icons/settings.svg" className="size-4" />}
      >
        Account
      </SidebarNavItem>
    </div>
  );
}
