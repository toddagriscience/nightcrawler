// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../components/account-info/account-info';
import { getAccountUsersData } from '../../db';

export default async function AccountUsersPage() {
  const accountUsersData = await getAccountUsersData();
  const principalOperator = accountUsersData.principalOperator;
  const ownerData = accountUsersData.owner;

  return (
    <AccountInfo title="User information">
      <AccountInfoSection title="Principal operator">
        <AccountInfoRow label="Name" value={principalOperator.firstName} />
        <AccountInfoRow label="Email Address" value={principalOperator.email} />
        <AccountInfoRow
          label="Phone Number"
          value={principalOperator.phone || 'None'}
        />
      </AccountInfoSection>

      <AccountInfoSection title="Owner">
        <AccountInfoRow
          label="Name"
          value={ownerData?.firstName ?? 'Not set'}
        />
        <AccountInfoRow
          label="Email Address"
          value={ownerData?.email ?? 'Not set'}
        />
        <AccountInfoRow
          label="Phone Number"
          value={ownerData?.phone ?? 'Not set'}
        />
      </AccountInfoSection>
    </AccountInfo>
  );
}
