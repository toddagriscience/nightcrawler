// Copyright © Todd Agriscience, Inc. All rights reserved.

import { requirePlatformOnboardingComplete } from '@/lib/utils/platform-onboarding';
import SidebarClient from '../components/sidebar/sidebar-client';
import Sidebar from '../components/sidebar/sidebar';
import { SidebarCollapseProvider } from '../components/sidebar/sidebar-collapse-context';
import { SearchPanelProvider } from '../components/search-panel/search-panel-context';
import { SearchPanel } from '../components/search-panel/search-panel';

/**
 * Layout for authenticated routes that render the platform sidebar.
 * The sidebar lives in this intermediate layout (not the root authenticated
 * layout), so the server renders it only for routes in this group — chrome-less
 * routes (onboarding, reset-password) never receive the sidebar markup, so there
 * is no client-side hydration flash.
 *
 * The platform-onboarding gate runs here, BEFORE the sidebar is rendered, so a
 * user who has not finished onboarding is redirected to `/apply` without the
 * sidebar ever painting. (Pre-onboarding surfaces — `/apply`, reset-password —
 * live in the sibling `(chromeless)` group and are never gated here.)
 *
 * @param {React.ReactNode} children - Nested route content
 * @returns {React.ReactNode} - The sidebar shell
 */
export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePlatformOnboardingComplete();

  return (
    <SidebarCollapseProvider>
      <SearchPanelProvider>
        <div className="flex h-screen overflow-hidden">
          <SidebarClient>
            <Sidebar />
          </SidebarClient>
          <div className="flex-1 min-w-0 overflow-y-auto px-6 py-6">
            {children}
          </div>
          <SearchPanel />
        </div>
      </SearchPanelProvider>
    </SidebarCollapseProvider>
  );
}
