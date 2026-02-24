// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../components/account-info/account-info';
import { getManagementZones } from '../../db';
import { toDisplayValue } from '../../util';

export default async function AccountManagementPage() {
  const managementZones = await getManagementZones();

  return (
    <AccountInfo title="Management Zones">
      {managementZones.length === 0 ? (
        <AccountInfoSection title={toDisplayValue()}>
          <AccountInfoRow label="Nickname" value={toDisplayValue()} />
          <AccountInfoRow
            label="Management zone profile"
            value=">"
            valueClassName="text-foreground"
            href="/account/management"
          />
        </AccountInfoSection>
      ) : (
        managementZones.map((zone) => (
          <AccountInfoSection key={zone.id} title={toDisplayValue(zone.name)}>
            <AccountInfoRow
              label="Nickname"
              value={toDisplayValue(zone.name)}
            />
            <AccountInfoRow
              label="Management zone profile"
              value=">"
              valueClassName="text-foreground"
              href={`/account/management-zones/${zone.id}`}
            />
          </AccountInfoSection>
        ))
      )}
    </AccountInfo>
  );
}
