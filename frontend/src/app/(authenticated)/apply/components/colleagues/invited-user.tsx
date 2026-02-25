// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { UserSelect } from '@/lib/types/db';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { RefreshCw, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { resendVerificationEmail, uninviteUser } from './action';

export default function InvitedUser({
  isVerified,
  invitedUser,
  isCurrentUser = false,
  onUninvited,
}: {
  isVerified: boolean;
  invitedUser: UserSelect;
  isCurrentUser?: boolean;
  onUninvited?: (userId: number) => void;
}) {
  const [isResendActive, setIsResendActive] = useState(true);
  const [uninviteError, setUninviteError] = useState<string | null>(null);
  const [isUninviting, setIsUninviting] = useState(false);

  // No error handling for this currently, we go full mvp!!!
  async function handleResend() {
    setIsResendActive(false);
    await resendVerificationEmail(invitedUser.email);
    setTimeout(() => setIsResendActive(true), 5000);
  }

  async function handleUninvite() {
    setUninviteError(null);
    setIsUninviting(true);
    const result = await uninviteUser(invitedUser.id);
    setIsUninviting(false);
    if (result.error) {
      setUninviteError(
        formatActionResponseErrors(result)[0] ?? 'Something went wrong'
      );
      return;
    }
    onUninvited?.(invitedUser.id);
  }

  return (
    <div className="flex flex-col gap-1 rounded-md border p-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex w-full flex-col sm:flex-row">
          <p className="font-medium">
            {invitedUser.firstName} {invitedUser.lastName}
          </p>
          <p className="text-muted-foreground sm:ml-2">({invitedUser.email})</p>
        </div>
        <div className="mr-3 flex flex-row items-center justify-center gap-2">
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
          {!isCurrentUser && (
            <Button
              onClick={handleUninvite}
              className="hover:cursor-pointer"
              disabled={isUninviting}
              variant="ghost"
              title="Uninvite"
            >
              <UserMinus className={isUninviting ? 'stroke-gray-500/40' : ''} />
            </Button>
          )}
        </div>
        <span className="text-muted-foreground text-sm">
          {invitedUser.role}
        </span>
      </div>
      {uninviteError && (
        <p className="text-destructive text-sm">{uninviteError}</p>
      )}
    </div>
  );
}
