// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { UserSelect } from '@/lib/types/db';
import { RefreshCw } from 'lucide-react';
import { resendVerificationEmail } from './action';
import { useState } from 'react';

export default function InvitedUser({
  isVerified,
  invitedUser,
}: {
  isVerified: boolean;
  invitedUser: UserSelect;
}) {
  const [isResendActive, setIsResendActive] = useState(true);

  // No error handling for this currently, we go full mvp!!!
  async function handleResend() {
    setIsResendActive(false);
    await resendVerificationEmail(invitedUser.email);
    setTimeout(() => setIsResendActive(true), 5000);
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-md border p-3">
      <div className="flex w-full flex-col sm:flex-row">
        <p className="font-medium">
          {invitedUser.firstName} {invitedUser.lastName}
        </p>
        <p className="text-muted-foreground sm:ml-2">({invitedUser.email})</p>
      </div>
      <div className="mr-3 flex flex-row items-center justify-center">
        <span
          className={`text-muted-foreground rounded-4xl border border-solid border-black/40 px-2 py-1 text-sm text-nowrap select-none ${isVerified ? 'bg-green-500/30' : 'bg-yellow-500/30'}`}
        >
          {isVerified ? 'Verified' : 'Not verified'}
        </span>
        {!isVerified && (
          <Button
            onClick={handleResend}
            className="hover:cursor-pointer"
            disabled={!isResendActive}
          >
            <RefreshCw
              className={!isResendActive ? 'stroke-gray-500/40' : ''}
            />
          </Button>
        )}
      </div>
      <span className="text-muted-foreground text-sm">{invitedUser.role}</span>
    </div>
  );
}
