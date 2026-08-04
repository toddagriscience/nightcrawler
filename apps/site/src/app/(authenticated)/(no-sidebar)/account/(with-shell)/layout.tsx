// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import AccountHeader from '../components/account-header/account-header';
import AccountSideMenu from '../components/account-side-menu/account-side-menu';
import { getAccountShellData } from '../db';

export const metadata: Metadata = {
  title: {
    default: 'Account | Todd',
    template: '%s | Todd',
  },
};

/**
 * Async server component that reads `cookies()` via `getAccountShellData`
 * inside the Suspense boundary so the layout can still be prerendered.
 *
 * @param props.children - Nested account page content
 * @returns The account shell with header and side menu
 */
async function AccountShell({ children }: { children: React.ReactNode }) {
  const accountShellData = await getAccountShellData();

  return (
    <div className="pb-14">
      <AccountHeader farmName={accountShellData.farmName} />
      <div className="mx-auto flex w-full max-w-[960px] gap-12 px-4 py-10">
        <AccountSideMenu />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

/**
 * Skeleton fallback rendered while the account shell data loads.
 *
 * @returns Placeholder layout matching the account shell structure
 */
function AccountShellFallback() {
  return (
    <div className="pb-14">
      <div className="border-b border-[#D9D9D9]">
        <div className="mx-auto mt-16 mb-10 flex w-full max-w-[1300px] items-center gap-22 px-5">
          <Skeleton className="h-6 w-16 bg-foreground/15" />
          <Skeleton className="h-9 w-48 bg-foreground/15" />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[960px] gap-12 px-4 py-10">
        <div className="mt-1 w-[190px] shrink-0">
          <Skeleton className="h-40 w-full bg-foreground/15" />
        </div>
        <main className="min-w-0 flex-1">
          <Skeleton className="h-64 w-full bg-foreground/15" />
        </main>
      </div>
    </div>
  );
}

/**
 * Account layout that wraps every `/account/*` page.
 * The cookies-dependent data fetch lives inside `<AccountShell>` so it
 * sits within the Suspense boundary and doesn't block prerendering.
 *
 * @param props.children - Nested account page content
 * @returns The account layout with a Suspense-wrapped shell
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AccountShellFallback />}>
      <AccountShell>{children}</AccountShell>
    </Suspense>
  );
}
