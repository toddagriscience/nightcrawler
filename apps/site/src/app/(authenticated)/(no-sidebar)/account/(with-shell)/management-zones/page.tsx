// Copyright © Todd Agriscience, Inc. All rights reserved.

import { BiChevronRight } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../components/account-info/account-info';
import { getManagementZones } from '../../db';
import { toDisplayValue } from '../../util';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { canEditFarm } from '@/lib/utils/farm-rbac';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { getFarmManagementZoneRequests } from './request/actions';

/** Lists the farm's zones and sample-request progress. */
export default async function AccountManagementPage() {
  const [managementZones, requests, actor] = await Promise.all([
    getManagementZones(),
    getFarmManagementZoneRequests(),
    getAuthenticatedInfo(),
  ]);

  return (
    <AccountInfo title="Management Zones">
      {canEditFarm(actor) && (
        <Button variant="brand" asChild>
          <Link href="/account/management-zones/request">
            Add management zone
          </Link>
        </Button>
      )}
      {managementZones.length === 0 ? (
        <AccountInfoSection title={toDisplayValue()}>
          <AccountInfoRow label="Nickname" value={toDisplayValue()} />
          <AccountInfoRow
            label="Management zone profile"
            value={<BiChevronRight className="size-6" />}
            valueClassName="text-foreground"
            href="/account/management-zones"
          />
        </AccountInfoSection>
      ) : (
        managementZones.map((zone) => (
          <AccountInfoSection key={zone.id} title={toDisplayValue(zone.name)}>
            <AccountInfoRow
              label="Nickname"
              value={toDisplayValue(zone.name)}
            />
            {requests
              .filter((request) => request.answers.zoneId === zone.id)
              .map((request) => (
                <AccountInfoRow
                  key={request.id}
                  label="Soil sample request"
                  value={
                    request.answers.stage === 'processed'
                      ? 'Processed'
                      : request.answers.stage === 'sample_kit_sent'
                        ? 'Sample kit sent'
                        : 'Requested'
                  }
                />
              ))}
            <AccountInfoRow
              label="Management zone profile"
              value={<BiChevronRight className="size-6" />}
              valueClassName="text-foreground"
              href={`/account/management-zones/${zone.id}`}
            />
          </AccountInfoSection>
        ))
      )}
    </AccountInfo>
  );
}
