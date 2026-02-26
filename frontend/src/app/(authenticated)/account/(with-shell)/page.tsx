// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../components/account-info/account-info';
import { getAccountFarmData } from '../db';

export default async function AccountPage() {
  const accountFarmData = await getAccountFarmData();
  const mailingAddress =
    accountFarmData.location?.address1 + ', ' + accountFarmData.location?.state;

  return (
    <AccountInfo title="Farm information">
      <div className="border-t border-black/20">
        <AccountInfoRow
          label="Nickname"
          value={accountFarmData.farm.informalName ?? ''}
        />
        <AccountInfoRow
          label="Legal Name"
          value={accountFarmData.farm.businessName ?? ''}
        />
        <AccountInfoRow
          label="Mailing Address"
          value={
            !accountFarmData.location?.address1 ||
            !accountFarmData.location?.state
              ? 'Not set'
              : mailingAddress
          }
        />
        <AccountInfoRow
          label="Farm profile"
          value=">"
          valueClassName="text-foreground"
          href="/account/farm/profile"
        />
      </div>

      <AccountInfoSection title="Account terms">
        {/** Get this integrated via stripe later :thumbsup: */}
        <AccountInfoRow label="Renewal" value="Not set" />
        <AccountInfoRow label="Billing cycle" value="Not set" />
        <AccountInfoRow label="Next billing date" value="Not set" />
        <AccountInfoRow label="Next payment" value="Not set" />
        <AccountInfoRow label="Payment method" value="Not set" />
        <AccountInfoRow
          label="Client since"
          value={accountFarmData.farm.createdAt.toLocaleString().split(',')[0]}
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
