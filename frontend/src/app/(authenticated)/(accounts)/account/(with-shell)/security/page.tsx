// Copyright © Todd Agriscience, Inc. All rights reserved.

import LogoutLink from '@/components/common/utils/logout-link/logout-link';
import Link from 'next/link';
import AccountInfo from '../../components/account-info/account-info';
import { ExternalLinkIcon } from 'lucide-react';

export default function AccountSecurityPage() {
  return (
    <AccountInfo
      title="Security"
      description="Keep your Todd account secure with additional layers of protection."
    >
      <div className="border-t border-black/20">
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-black/20 py-1">
          <span className="text-foreground text-[16px] leading-tight font-normal">
            Password
          </span>
          <Link
            href="/account/reset-password"
            className="text-foreground flex flex-row items-center justify-center gap-2 text-[16px] leading-tight font-normal hover:opacity-70"
          >
            Update password
            <ExternalLinkIcon strokeWidth={1} />
          </Link>
        </div>
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-black/20 py-1">
          <span className="text-foreground text-[16px] leading-tight font-light italic">
            Devices
          </span>
        </div>
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-black/20 py-1">
          <span className="text-foreground text-[16px] leading-tight font-light italic">
            Passkeys
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <LogoutLink
          label="Log out"
          className="text-foreground text-[16px] leading-none font-light hover:cursor-pointer hover:opacity-70"
        />
      </div>
    </AccountInfo>
  );
}
