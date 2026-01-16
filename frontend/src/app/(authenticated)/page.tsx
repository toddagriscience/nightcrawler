// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import type { Metadata } from 'next';

/**
 * Dashboard homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: 'Home | Todd',
};

/**
 * Dashboard page - served at "/" route for authenticated users
 * This page is protected by middleware and only accessible to authenticated users
 * @returns {React.ReactNode} - The dashboard page component
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="text-center space-y-4">
        <p className="text-foreground text-base font-normal">Today</p>
        <h1 className="text-foreground text-3xl font-bold">Welcome</h1>
        <p className="text-foreground text-base font-normal">
          Thank you for being a Todd client since 2025
        </p>
        <Link
          href="/contact"
          className="text-foreground text-base font-normal underline hover:opacity-70 transition-opacity inline-block mt-4"
        >
          Experiencing an Issue?
        </Link>
      </div>
    </div>
  );
}
