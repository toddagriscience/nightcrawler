// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getStripeSubscriptionData } from '@/lib/utils/stripe';
import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../components/account-info/account-info';
import { getAccountFarmData } from '../db';

/** Renders a value or a refined empty state marker. */
function EmptyValue() {
  return (
    <span aria-hidden="true" className="text-muted-foreground/50 italic">
      —
    </span>
  );
}

/** Determines if a string value represents an unset/unconfigured state. */
function isUnset(value: string | undefined | null): boolean {
  return !value || value.trim() === '' || value === 'Not set';
}

export default async function AccountPage() {
  const [accountFarmData, stripeData] = await Promise.all([
    getAccountFarmData(),
    getStripeSubscriptionData(),
  ]);
  const mailingAddress =
    accountFarmData.location?.address1 && accountFarmData.location?.state
      ? `${accountFarmData.location.address1}, ${accountFarmData.location.state}`
      : null;

  return (
    <AccountInfo title="Farm information">
      <div className="mt-5 border-t border-[var(--border)]">
        <AccountInfoRow
          label="Nickname"
          value={accountFarmData.farm.informalName}
          isEmpty={isUnset(accountFarmData.farm.informalName)}
        />
        <AccountInfoRow
          label="Legal Name"
          value={accountFarmData.farm.businessName}
          isEmpty={isUnset(accountFarmData.farm.businessName)}
        />
        <AccountInfoRow
          label="Mailing Address"
          value={mailingAddress}
          isEmpty={!mailingAddress}
        />
        <AccountInfoRow
          label="Farm profile"
          rightContent={
            <BiChevronRight className="size-5 text-[var(--muted-foreground)]" />
          }
          href="/account/farm/profile"
        />
      </div>

      <AccountInfoSection title="Account terms">
        {stripeData.renewal && (
          <AccountInfoRow label="Renewal" value={stripeData.renewal} />
        )}
        {stripeData.billingCycle && (
          <AccountInfoRow
            label="Billing cycle"
            value={stripeData.billingCycle}
          />
        )}
        {stripeData.nextBillingDate && (
          <AccountInfoRow
            label="Next billing date"
            value={stripeData.nextBillingDate}
          />
        )}
        {stripeData.nextPayment && (
          <AccountInfoRow label="Next payment" value={stripeData.nextPayment} />
        )}
        {stripeData.paymentMethod && (
          <AccountInfoRow
            label="Payment method"
            value={stripeData.paymentMethod}
          />
        )}
        <AccountInfoRow
          label="Client since"
          value={accountFarmData.farm.createdAt.toLocaleString().split(',')[0]}
        />
      </AccountInfoSection>

      <div className="mt-8 flex justify-end">
        <Link
          href={'/contact'}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:underline hover:underline-offset-4 transition-colors duration-200"
        >
          Request deactivation
        </Link>
      </div>
    </AccountInfo>
  );
}
