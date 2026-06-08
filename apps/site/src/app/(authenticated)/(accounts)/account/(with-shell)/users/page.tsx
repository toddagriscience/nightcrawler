// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../components/account-info/account-info';
import { getAccountUsersData } from '../../db';
import { toDisplayName, toDisplayValue } from '../../util';

/**
 * Account Users page displaying principal operator and owner information.
 * Organized into clear groupings with graceful handling of missing data.
 */
export default async function AccountUsersPage() {
  const accountUsersData = await getAccountUsersData();
  const principalOperator = accountUsersData.principalOperator;
  const ownerData = accountUsersData.owner;

  return (
    <AccountInfo title="User information">
      <AccountInfoSection title="Principal operator">
        <AccountInfoRow
          label="Name"
          value={toDisplayName(
            principalOperator.firstName,
            principalOperator.lastName
          )}
        />
        <AccountInfoRow
          label="Email Address"
          value={toDisplayValue(principalOperator.email)}
        />
        <AccountInfoRow
          label="Phone Number"
          value={toDisplayValue(principalOperator.phone)}
        />
      </AccountInfoSection>

      <AccountInfoSection title="Owner">
        <AccountInfoRow
          label="Name"
          value={toDisplayName(ownerData?.firstName, ownerData?.lastName)}
        />
        <AccountInfoRow
          label="Email Address"
          value={toDisplayValue(ownerData?.email)}
        />
        <AccountInfoRow
          label="Phone Number"
          value={toDisplayValue(ownerData?.phone)}
        />
      </AccountInfoSection>
    </AccountInfo>
  );
}
