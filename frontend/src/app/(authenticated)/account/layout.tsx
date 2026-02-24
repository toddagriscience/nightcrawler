// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import AccountHeader from './components/account-header/account-header';
import AccountSideMenu from './components/account-side-menu/account-side-menu';
import { getAccountShellData } from './data/account-data';

export const metadata: Metadata = {
  title: {
    default: 'Account | Todd',
    template: '%s | Todd',
  },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accountShellData = await getAccountShellData();

  return (
    <div className="pb-16">
      <AccountHeader farmName={accountShellData.farmName} />
      <div className="mx-auto flex w-full max-w-[960px] gap-12 px-4 py-14">
        <AccountSideMenu />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
