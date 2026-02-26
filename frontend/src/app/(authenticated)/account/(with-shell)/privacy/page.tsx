// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
} from '../../components/account-info/account-info';

export default function AccountPrivacyPage() {
  return (
    <AccountInfo title="Privacy" description="Manage how your data is used.">
      <div className="border-t border-black/20">
        <AccountInfoRow label="Personal Information Sharing" value="Disabled" />
        <AccountInfoRow
          label="Request Personal Data"
          value=">"
          valueClassName="text-foreground"
          href="/contact"
        />
        <AccountInfoRow
          label="Request Data Deletion"
          value=">"
          valueClassName="text-foreground"
          href="/contact"
        />
        <AccountInfoRow
          label="Privacy Policy"
          value=">"
          valueClassName="text-foreground"
          href="/en/privacy"
        />
      </div>
    </AccountInfo>
  );
}
