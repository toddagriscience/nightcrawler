// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Sidebar } from '@/components/sidebar';
import type { Metadata } from 'next';

/**
 * Force dynamic rendering for all dashboard routes to avoid build-time database access.
 */
export const dynamic = 'force-dynamic';

/**
 * Dashboard layout metadata
 */
export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Todd Internal',
  },
};

/**
 * Dashboard layout with vertical sidebar navigation.
 * All authenticated pages use this layout.
 * @param children - Child page content
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
