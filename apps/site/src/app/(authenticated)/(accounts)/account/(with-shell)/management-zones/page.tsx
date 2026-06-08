// Copyright © Todd Agriscience, Inc. All rights reserved.

import { BiChevronRight } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../components/account-info/account-info';
import { getManagementZones } from '../../db';
import { toDisplayValue } from '../../util';

/**
 * Management Zones page for farm operational zones.
 * Displays configured zones as actionable data rows with status indicators.
 */
export default async function AccountManagementPage() {
  const managementZones = await getManagementZones();

  return (
    <AccountInfo title="Management Zones">
      {managementZones.length === 0 ? (
        <AccountInfoSection title="No Zones Configured">
          <AccountInfoRow
            label="Getting Started"
            value="Set up your first management zone"
            href="/account/management-zones"
          />
        </AccountInfoSection>
      ) : (
        <AccountInfoSection
          title={`${managementZones.length} Zone${managementZones.length !== 1 ? 's' : ''}`}
        >
          {managementZones.map((zone) => (
            <AccountInfoRow
              key={zone.id}
              label={toDisplayValue(zone.name)}
              value={
                <div className="flex items-center gap-2">
                  <span className="text-[var(--zone-active)] text-xs font-medium uppercase tracking-wider">
                    Active
                  </span>
                  <BiChevronRight className="size-4 text-[var(--foreground-muted)]" />
                </div>
              }
              href={`/account/management-zones/${zone.id}`}
            />
          ))}
        </AccountInfoSection>
      )}
    </AccountInfo>
  );
}
