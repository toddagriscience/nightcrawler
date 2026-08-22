// Copyright © Todd Agriscience, Inc. All rights reserved.

import { requirePlatformOnboardingComplete } from '@/lib/utils/platform-onboarding';

/**
 * Layout for authenticated routes that go through the platform-onboarding
 * gate but render WITHOUT the platform sidebar (unlike the sibling `(shell)`
 * group, which renders the sidebar for everything under it). Account settings
 * pages live here so they keep their own header/sub-nav chrome without the
 * app-wide sidebar.
 *
 * @param {React.ReactNode} children - Nested route content
 * @returns {React.ReactNode} - The gated, sidebar-less content
 */
export default async function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePlatformOnboardingComplete();

  return children;
}
