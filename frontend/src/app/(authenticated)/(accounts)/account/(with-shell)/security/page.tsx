// Copyright © Todd Agriscience, Inc. All rights reserved.

import LogoutLink from '@/components/common/utils/logout-link/logout-link';
import Link from 'next/link';
import { BiLock } from 'react-icons/bi';
import AccountInfo from '../../components/account-info/account-info';

export default function AccountSecurityPage() {
  return (
    <AccountInfo
      title="Security"
      description="Keep your Todd account secure with additional layers of protection."
    >
      <div className="border-t border-black/20">
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-black/20 py-1">
          <span className="text-sm leading-tight">Password</span>
          <Link
            href="/account/reset-password"
            className="text-foreground flex flex-row items-center justify-center gap-1.5 text-sm leading-tight font-normal hover:text-foreground/70"
          >
            Update password
            <BiLock className="size-4" />
          </Link>
        </div>
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-black/20 py-1">
          <span className="text-sm leading-tight">Devices</span>
        </div>
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-black/20 py-1">
          <span className="text-sm leading-tight">Passkeys</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <LogoutLink
          label="Log out"
          className="text-foreground flex flex-row items-center justify-center gap-1.5 text-sm hover:cursor-pointer hover:opacity-70"
        />
      </div>
    </AccountInfo>
  );
}
