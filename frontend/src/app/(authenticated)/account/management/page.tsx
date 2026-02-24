// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../components/account-info/account-info';
import { getAccountManagementData } from '../data/account-data';

export default async function AccountManagementPage() {
  const accountManagementData = await getAccountManagementData();

  return (
    <AccountInfo title="Management Zones">
      <AccountInfoSection title={accountManagementData.sectionTitle}>
        <AccountInfoRow
          label="Nickname"
          value={accountManagementData.nickname}
        />
        <AccountInfoRow
          label="Management zone profile"
          value=">"
          valueClassName="text-foreground"
        />
      </AccountInfoSection>

      <div className="mt-10">
        <button className="text-foreground rounded-full border border-black/60 px-6 py-2 text-[16px] leading-none font-[400] hover:bg-black/5">
          Manage Management Zone
        </button>
      </div>
    </AccountInfo>
  );
}
