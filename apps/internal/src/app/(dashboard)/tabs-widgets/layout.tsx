// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/** Tabs & Widgets page metadata */
export const metadata: Metadata = {
  title: 'Tabs & Widgets',
  description: "Manage users' tabs and widgets.",
};

/**
 * Layout for the tabs & widgets page.
 * @param children - Page content
 */
export default function TabsWidgetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
