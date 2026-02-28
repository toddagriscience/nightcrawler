// Copyright © Todd Agriscience, Inc. All rights reserved.

import { notFound } from 'next/navigation';
import AccountInfo from '../../../components/account-info/account-info';
import ManagementZoneForm from './management-zone-form';
import { db } from '@/lib/db/schema/connection';
import { managementZone } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

export default async function ManagementZonePage({
  params,
}: {
  params: Promise<{ zone: string }>;
}) {
  const currentUser = await getAuthenticatedInfo();

  const { zone } = await params;
  const zoneId = Number(zone);

  if (!Number.isInteger(zoneId)) {
    notFound();
  }

  const [curManagementZone] = await db
    .select()
    .from(managementZone)
    .where(
      and(
        eq(managementZone.id, zoneId),
        eq(managementZone.farmId, currentUser.farmId)
      )
    )
    .limit(1);

  if (!curManagementZone) {
    notFound();
  }

  return (
    <AccountInfo
      title={curManagementZone.name ?? 'Unnamed zone'}
      description="Edit management zone details."
    >
      <ManagementZoneForm zone={curManagementZone} />
    </AccountInfo>
  );
}
