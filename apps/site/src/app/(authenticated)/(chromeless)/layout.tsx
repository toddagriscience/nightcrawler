// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Layout for authenticated routes that render WITHOUT the platform sidebar —
 * the pre-platform-access onboarding funnel (apply / welcome /
 * application-success) and the bare reset-password screen. The sidebar lives in
 * the sibling `(shell)` layout, so these routes never server-render it.
 *
 * @param {React.ReactNode} children - Nested route content
 * @returns {React.ReactNode} - The chrome-less content container
 */
export default function ChromelessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-y-auto px-6 py-6">{children}</div>;
}
