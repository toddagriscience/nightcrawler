// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import LogoutLink from '@/components/common/utils/logout-link/logout-link';
import AccountInfo, {
  AccountInfoRow,
} from '../components/account-info/account-info';

export default function AccountSecurityPage() {
  return (
    <AccountInfo
      title="Security"
      description="Keep your Todd account secure with additional layers of protection."
    >
      <div className="border-black/20 border-t">
        <AccountInfoRow
          label="Password"
          rightContent={
            <Link
              href="/account/reset-password"
              className="text-foreground font-[400] hover:opacity-70"
            >
              Update Password
            </Link>
          }
        />
        <AccountInfoRow label="Devices" />
        <AccountInfoRow label="Passkeys" />
      </div>

      <div className="mt-4 flex justify-end">
        <LogoutLink
          label="Log out"
          className="text-foreground text-[16px] leading-none font-[400] hover:opacity-70"
        />
      </div>
    </AccountInfo>
  );
}
