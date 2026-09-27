// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import type { InvitedUserProps } from '@/app/(onboarding)/apply/components/types';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiRefresh, BiUserMinus } from 'react-icons/bi';

/** Displays an invited teammate with resend and removal controls. */
export default function InvitedUser({
  isVerified,
  invitedUser,
  isCurrentUser = false,
  canEditFarm,
  onUninvited,
}: InvitedUserProps) {
  const { actions } = useContext(ApplicationContext);
  const [isResendActive, setIsResendActive] = useState(true);
  const cooldown = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(
    () => () => {
      if (cooldown.current) clearTimeout(cooldown.current);
    },
    []
  );

  async function handleResend() {
    if (!canEditFarm || !isResendActive || isVerified) return;
    clearErrors();
    try {
      await actions.resendVerificationEmail(invitedUser.email);
      setIsResendActive(false);
      cooldown.current = setTimeout(() => setIsResendActive(true), 5000);
    } catch (error) {
      setError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'Unable to resend the invitation. Please try again.',
      });
    }
  }

  async function handleUninvite() {
    if (!canEditFarm || isCurrentUser) return;
    clearErrors();
    try {
      await actions.uninviteUser(invitedUser.id);
    } catch (error) {
      setError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'Unable to remove the invitation. Please try again.',
      });
      return;
    }

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
              variant="ghost"
              type="button"
              onClick={() => void handleSubmit(handleResend)()}
              className="hover:cursor-pointer hover:text-green-500"
              disabled={!isResendActive || isSubmitting}
              title="Resend verification email"
              aria-label={`Resend invitation to ${invitedUser.firstName} ${invitedUser.lastName}`}
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
              type="button"
              onClick={() => void handleSubmit(handleUninvite)()}
              className="hover:cursor-pointer"
              disabled={isSubmitting}
              variant="ghost"
              title="Uninvite"
              aria-label={`Remove ${invitedUser.firstName} ${invitedUser.lastName}`}
            >
              <BiUserMinus
                className={isSubmitting ? 'text-red-500' : 'text-foreground/80'}
                style={{ width: 22, height: 22 }}
              />
            </Button>
          )}
        </div>
        <span className="text-muted-foreground text-sm">
          {invitedUser.role}
        </span>
      </div>
      {errors.root?.message && (
        <p role="alert" className="text-destructive text-sm">
          {errors.root.message}
        </p>
      )}
    </div>
  );
}
