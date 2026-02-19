// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '@/lib/db/schema/connection';
import { farm } from '@/lib/db/schema/farm';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';
import AccountHeader from '../components/account-header';
import AccountSidebar from '../components/account-sidebar';

/**
 * Layout for the account settings section.
 * Renders an account header with a back button and farm name,
 * a vertical sidebar with navigation tabs on the left, and page content on the right.
 * The authenticated header is hidden on account pages (handled by AuthenticatedHeader).
 * @param {React.ReactNode} children - The children of the layout
 * @returns {Promise<React.ReactNode>} - The account settings layout with header and sidebar navigation
 */
export default async function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getAuthenticatedInfo();

  const [currentFarm] = await db
    .select({
      informalName: farm.informalName,
      businessName: farm.businessName,
    })
    .from(farm)
    .where(eq(farm.id, currentUser.farmId))
    .limit(1);

  const farmName =
    currentFarm?.informalName ?? currentFarm?.businessName ?? 'My Farm';

  return (
    <div className="flex min-h-screen flex-col">
      <AccountHeader farmName={farmName} />
      <div className="mx-auto flex w-[70vw] max-w-400 flex-1">
        <AccountSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
