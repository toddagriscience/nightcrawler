// Copyright © Todd Agriscience, Inc. All rights reserved.

import { BiChevronRight } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
} from '../../components/account-info/account-info';

export default function AccountPrivacyPage() {
  return (
    <AccountInfo title="Privacy" description="Manage how your data is used.">
      <div className="border-t border-[#D9D9D9]">
        <AccountInfoRow label="Personal Information Sharing" value="Disabled" />
        <AccountInfoRow
          label="Request Personal Data"
          value={<BiChevronRight className="size-6" />}
          valueClassName="text-foreground"
          href="/contact"
        />
        <AccountInfoRow
          label="Request Data Deletion"
          value={<BiChevronRight className="size-6" />}
          valueClassName="text-foreground"
          href="/contact"
        />
        <AccountInfoRow
          label="Privacy Policy"
          value={<BiChevronRight className="size-6" />}
          valueClassName="text-foreground"
          href="/en/privacy"
        />
      </div>
    </AccountInfo>
  );
}
