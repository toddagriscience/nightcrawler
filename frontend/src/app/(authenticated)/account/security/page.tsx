// Copyright © Todd Agriscience, Inc. All rights reserved.

import LogoutLink from '@/components/common/utils/logout-link/logout-link';
import AccountInfo from '../components/account-info/account-info';
import AccountPasswordResetInline from '../components/account-password-reset-inline/account-password-reset-inline';

export default function AccountSecurityPage() {
  return (
    <AccountInfo
      title="Security"
      description="Keep your Todd account secure with additional layers of protection."
    >
      <div className="border-black/20 border-t">
        <AccountPasswordResetInline />
        <div className="border-black/20 flex min-h-12 items-center justify-between gap-4 border-b py-1">
          <span className="text-foreground text-[16px] leading-tight font-[400]">
            Devices
          </span>
        </div>
        <div className="border-black/20 flex min-h-12 items-center justify-between gap-4 border-b py-1">
          <span className="text-foreground text-[16px] leading-tight font-[400]">
            Passkeys
          </span>
        </div>
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
