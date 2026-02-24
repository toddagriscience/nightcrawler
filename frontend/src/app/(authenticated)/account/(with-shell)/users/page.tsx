// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../components/account-info/account-info';
import { getAccountUsersData } from '../../db';

export default async function AccountUsersPage() {
  const accountUsersData = await getAccountUsersData();
  const ownerData = accountUsersData.owner;

  return (
    <AccountInfo title="User information">
      <AccountInfoSection title="Principal operator">
        <AccountInfoRow
          label="Name"
          value={accountUsersData.principalOperator.name}
        />
        <AccountInfoRow
          label="Email Address"
          value={accountUsersData.principalOperator.email}
          status={
            accountUsersData.principalOperator.emailVerified
              ? 'Verified'
              : 'Unverified'
          }
          statusTone={
            accountUsersData.principalOperator.emailVerified
              ? 'success'
              : 'warning'
          }
        />
        <AccountInfoRow
          label="Phone Number"
          value={accountUsersData.principalOperator.phone}
          status={
            accountUsersData.principalOperator.phoneVerified
              ? 'Verified'
              : 'Unverified'
          }
          statusTone={
            accountUsersData.principalOperator.phoneVerified
              ? 'success'
              : 'warning'
          }
        />
      </AccountInfoSection>

      <AccountInfoSection title="Owner">
        <AccountInfoRow label="Name" value={ownerData?.name ?? 'Not set'} />
        <AccountInfoRow
          label="Email Address"
          value={ownerData?.email ?? 'Not set'}
          status={ownerData?.emailVerified ? 'Verified' : 'Unverified'}
          statusTone={ownerData?.emailVerified ? 'success' : 'warning'}
        />
        <AccountInfoRow
          label="Phone Number"
          value={ownerData?.phone ?? 'Not set'}
          status={ownerData?.phoneVerified ? 'Verified' : 'Unverified'}
          statusTone={ownerData?.phoneVerified ? 'success' : 'warning'}
        />
      </AccountInfoSection>
    </AccountInfo>
  );
}
