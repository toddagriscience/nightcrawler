// Copyright © Todd Agriscience, Inc. All rights reserved.

import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';

/**
 * Chrome-less layout that keeps the platform top header but not the sidebar.
 * Used by the pre-platform-access onboarding funnel (apply / welcome /
 * application-success) and the authenticated contact page — all reachable while
 * onboarding is incomplete (this group is not behind the onboarding gate that
 * the sibling `(shell)` layout applies).
 *
 * @param {React.ReactNode} children - Nested route content
 * @returns {React.ReactNode} - Header + content, no sidebar
 */
export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthenticatedHeader />
      {children}
    </>
  );
}
