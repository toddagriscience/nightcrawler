// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarNavItem from './sidebar-nav-item';
import { LuLifeBuoy, LuSettings } from 'react-icons/lu';

/**
 * Sidebar footer — renders the Support and Account navigation entries pinned to
 * the bottom of the sidebar.
 *
 * @returns {React.ReactNode} - The sidebar account footer
 */
export default function SidebarUserFooter() {
  return (
    <div className="border-t border-[#D9D9D9]/30 px-3 py-3">
      <SidebarNavItem
        href="/support-tools"
        icon={<LuLifeBuoy className="size-4" />}
      >
        Support
      </SidebarNavItem>
      <SidebarNavItem
        href="/account"
        prefixMatch
        icon={<LuSettings className="size-4" />}
      >
        Account
      </SidebarNavItem>
    </div>
  );
}
