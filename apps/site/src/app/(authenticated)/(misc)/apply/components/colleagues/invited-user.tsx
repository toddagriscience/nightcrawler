// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { UserSelect } from '@/lib/types/db';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useState } from 'react';
import { BiRefresh, BiUserMinus } from 'react-icons/bi';
import { resendVerificationEmail, uninviteUser } from './action';

export default function InvitedUser({
  isVerified,
  invitedUser,
  isCurrentUser = false,
  canEditFarm,
  onUninvited,
}: {
  isVerified: boolean;
  invitedUser: UserSelect;
  isCurrentUser?: boolean;
  canEditFarm: boolean;
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
    try {
      await uninviteUser(invitedUser.id);
    } catch (error) {
      setIsUninviting(false);
      setUninviteError(
        formatActionResponseErrors(error)[0] ?? 'Something went wrong'
      );
      return;
    }

    setIsUninviting(false);
    onUninvited?.(invitedUser.id);
  }

  return (
    <div className="flex flex-col gap-1 rounded-md border p-6 border-[#848484]/80">
      <div className="flex flex-row items-center justify-between mx-2">
        <div className="flex w-full flex-col">
          <p className="font-thin text-base">
            {invitedUser.firstName} {invitedUser.lastName}
          </p>
          <p className="text-foreground/80 text-sm font-thin sm:ml-1">
            {invitedUser.email}
          </p>
        </div>
        <div className="mr-8 flex flex-row items-center justify-center gap-2">
          <span
            className={`text-foreground/80 rounded-4xl border border-solid border-black/40 px-2 py-1 text-xs font-normal text-nowrap select-none ${isVerified ? 'bg-green-500/30' : 'bg-yellow-500/30'}`}
          >
            {isVerified ? 'Verified' : 'Not verified'}
          </span>
          {canEditFarm && !isVerified && (
            <Button
              onClick={handleResend}
              className="hover:cursor-pointer hover:text-green-500"
              disabled={!isResendActive}
              title="Resend verification email"
            >
              <BiRefresh
                className={
                  !isResendActive ? 'text-green-500' : 'text-foreground/80'
                }
                style={{ width: 22, height: 22 }}
              />
            </Button>
          )}
          {canEditFarm && !isCurrentUser && (
            <Button
              onClick={handleUninvite}
              className="hover:cursor-pointer"
              disabled={isUninviting}
              variant="ghost"
              title="Uninvite"
            >
              <BiUserMinus
                className={isUninviting ? 'text-red-500' : 'text-foreground/80'}
                style={{ width: 22, height: 22 }}
              />
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
