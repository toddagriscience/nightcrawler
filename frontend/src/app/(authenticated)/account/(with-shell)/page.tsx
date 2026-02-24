// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../components/account-info/account-info';
import { getAccountFarmData } from '../db';

export default async function AccountPage() {
  const accountFarmData = await getAccountFarmData();

  return (
    <AccountInfo title="Farm information">
      <div className="border-black/20 border-t">
        <AccountInfoRow label="Nickname" value={accountFarmData.nickname} />
        <AccountInfoRow label="Legal Name" value={accountFarmData.legalName} />
        <AccountInfoRow
          label="Physical Location"
          value={accountFarmData.physicalLocation}
        />
        <AccountInfoRow
          label="Mailing Address"
          value={accountFarmData.mailingAddress}
        />
        <AccountInfoRow
          label="Farm profile"
          value=">"
          valueClassName="text-foreground"
          href="/account"
        />
      </div>

      <AccountInfoSection title="Account terms">
        <AccountInfoRow label="Renewal" value="Not set" />
        <AccountInfoRow label="Billing cycle" value="Not set" />
        <AccountInfoRow label="Next billing date" value="Not set" />
        <AccountInfoRow label="Next payment" value="Not set" />
        <AccountInfoRow label="Payment method" value="Not set" />
        <AccountInfoRow
          label="Client since"
          value={accountFarmData.clientSince}
        />
      </AccountInfoSection>

      <div className="mt-4 flex justify-end">
        <button className="text-[16px] leading-none font-[400] text-[#ff4d00] hover:opacity-80">
          Request deactivation
        </button>
      </div>
    </AccountInfo>
  );
}
