// Copyright © Todd Agriscience, Inc. All rights reserved.

import SidebarClient from '../components/sidebar/sidebar-client';
import Sidebar from '../components/sidebar/sidebar';
import { SidebarCollapseProvider } from '../components/sidebar/sidebar-collapse-context';

/**
 * Layout for authenticated routes that render the platform sidebar.
 * Because the sidebar lives in this intermediate layout (not the root
 * authenticated layout), the server renders it only for routes in this group —
 * chrome-less routes (onboarding, reset-password) never receive the sidebar
 * markup, so there is no client-side hydration flash.
 *
 * @param {React.ReactNode} children - Nested route content
 * @returns {React.ReactNode} - The sidebar shell
 */
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarCollapseProvider>
      <div className="flex h-screen overflow-hidden">
        <SidebarClient>
          <Sidebar />
        </SidebarClient>
        <div className="flex-1 min-w-0 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
