// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
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
          value={<BiChevronRight className="size-5" />}
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

      <div className="mt-5 flex justify-end px-0.5">
        <Link
          href={'/contact'}
          className="text-normal text-sm leading-none font-normal text-[#ff4d00] hover:opacity-80"
        >
          Request deactivation
        </Link>
      </div>
    </AccountInfo>
  );
}
