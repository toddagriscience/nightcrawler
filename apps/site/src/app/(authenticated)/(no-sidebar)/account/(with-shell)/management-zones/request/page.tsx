// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo from '../../../components/account-info/account-info';
import { canEditFarm } from '@/lib/utils/farm-rbac';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import ManagementZoneRequestForm from './management-zone-request-form';
import { requestManagementZone } from './actions';

/** Parcel request page; only farm Admins can submit requests. */
export default async function ManagementZoneRequestPage() {
  const actor = await getAuthenticatedInfo();
  return (
    <AccountInfo
      title="Add management zone"
      backHref="/account/management-zones"
      backLabel="Management zones"
    >
      {canEditFarm(actor) ? (
        <ManagementZoneRequestForm submitRequest={requestManagementZone} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Ask a farm Admin to request a management zone.
        </p>
      )}
    </AccountInfo>
  );
}
