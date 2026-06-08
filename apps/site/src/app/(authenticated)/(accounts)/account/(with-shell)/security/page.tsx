// Copyright © Todd Agriscience, Inc. All rights reserved.

import { BiLock } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
} from '../../components/account-info/account-info';
import LogoutLink from '@/components/common/utils/logout-link/logout-link';

export default function AccountSecurityPage() {
  return (
    <AccountInfo
      title="Security"
      description="Keep your Todd account secure with additional layers of protection."
    >
      <div className="border-t border-[var(--border)]">
        <AccountInfoRow
          label="Password"
          value={<BiLock className="size-4" />}
          valueClassName="text-muted-foreground"
          href="/account/reset-password"
        />
        <AccountInfoRow label="Devices" />
        <AccountInfoRow label="Passkeys" />
      </div>

      <div className="mt-6 flex justify-end">
        <LogoutLink
          label="Log out"
          className="text-foreground flex flex-row items-center gap-1.5 text-sm hover:opacity-70"
        />
      </div>
    </AccountInfo>
  );
}
