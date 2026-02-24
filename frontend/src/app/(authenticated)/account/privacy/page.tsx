// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import AccountInfo, {
  AccountInfoRow,
} from '../components/account-info/account-info';

export default function AccountPrivacyPage() {
  return (
    <AccountInfo title="Privacy" description="Manage how your data is used.">
      <div className="border-black/20 border-t">
        <AccountInfoRow label="Personal Information Sharing" value="Disabled" />
        <AccountInfoRow
          label="Request Personal Data"
          rightContent={
            <Link
              href="/contact"
              className="text-foreground font-[400] hover:opacity-70"
            >
              &gt;
            </Link>
          }
        />
        <AccountInfoRow
          label="Request Data Deletion"
          rightContent={
            <Link
              href="/contact"
              className="text-foreground font-[400] hover:opacity-70"
            >
              &gt;
            </Link>
          }
        />
        <AccountInfoRow
          label="Privacy Policy"
          rightContent={
            <Link
              href="/privacy"
              className="text-foreground font-[400] hover:opacity-70"
            >
              &gt;
            </Link>
          }
        />
      </div>
    </AccountInfo>
  );
}
