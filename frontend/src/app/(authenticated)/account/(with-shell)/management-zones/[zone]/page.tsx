// Copyright © Todd Agriscience, Inc. All rights reserved.

import { notFound } from 'next/navigation';
import AccountInfo from '../../../components/account-info/account-info';
import { getManagementZone } from '../../../db';
import { toDisplayValue } from '../../../util';
import ManagementZoneForm from './management-zone-form';

export default async function ManagementZonePage({
  params,
}: {
  params: Promise<{ zone: string }>;
}) {
  const { zone } = await params;
  const zoneId = Number(zone);

  if (!Number.isInteger(zoneId)) {
    notFound();
  }

  const managementZone = await getManagementZone(zoneId);

  if (!managementZone) {
    notFound();
  }

  return (
    <AccountInfo
      title={toDisplayValue(managementZone.name)}
      description="Edit management zone details."
    >
      <ManagementZoneForm zone={managementZone} />
    </AccountInfo>
  );
}
