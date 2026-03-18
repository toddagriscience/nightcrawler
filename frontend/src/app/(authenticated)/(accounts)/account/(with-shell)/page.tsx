// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getStripeSubscriptionData } from '@/lib/utils/stripe';
import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../components/account-info/account-info';
import { getAccountFarmData } from '../db';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const [accountFarmData, stripeData] = await Promise.all([
    getAccountFarmData(),
    getStripeSubscriptionData(),
  ]);
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
          value={<BiChevronRight className="size-6" />}
          valueClassName="text-foreground"
          href="/account/farm/profile"
        />
      </div>

      <AccountInfoSection title="Account terms">
        <AccountInfoRow label="Renewal" value={stripeData.renewal} />
        <AccountInfoRow label="Billing cycle" value={stripeData.billingCycle} />
        <AccountInfoRow
          label="Next billing date"
          value={stripeData.nextBillingDate}
        />
        <AccountInfoRow label="Next payment" value={stripeData.nextPayment} />
        <AccountInfoRow
          label="Payment method"
          value={stripeData.paymentMethod}
        />
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
