// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { updateUser } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { Eye, EyeOff } from 'lucide-react';
import { useActionState, useMemo, useState } from 'react';

function PasswordField({
  id,
  label,
  name,
  value,
  onChange,
  show,
  toggleShow,
  error,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  toggleShow: () => void;
  error?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_430px] items-start gap-8">
      <label htmlFor={id} className="text-[16px] leading-tight font-[400]">
        {label}
      </label>
      <div>
        <div
          className={`flex h-12 items-center justify-between rounded-[10px] border px-4 ${
            error ? 'border-[#ff4d00]' : 'border-black/50'
          }`}
        >
          <input
            id={id}
            name={name}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full bg-transparent text-[16px] leading-none font-[400] outline-none"
          />
          <button
            type="button"
            onClick={toggleShow}
            aria-label={show ? `Hide ${label}` : `Show ${label}`}
            className="pl-3"
          >
            {show ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {error ? (
          <p className="mt-2 text-[14px] leading-tight font-[400] text-[#ff4d00]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function AccountPasswordResetInline() {
  const [state, updateUserAction] = useActionState(updateUser, null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const newPasswordError =
    newPassword.length > 0 && newPassword.length < 10
      ? 'Password required a minimum of 10 characters.'
      : '';
  const confirmPasswordError =
    confirmNewPassword.length > 0 && confirmNewPassword.length < 10
      ? 'Password required a minimum of 10 characters.'
      : '';

  const validationError =
    confirmNewPassword.length > 0 &&
    confirmNewPassword.length >= 10 &&
    newPassword.length >= 10 &&
    confirmNewPassword !== newPassword
      ? "Passwords don't match"
      : '';

  const canSubmit =
    newPassword.length >= 10 &&
    confirmNewPassword.length >= 10 &&
    newPassword === confirmNewPassword;

  const actionErrors = useMemo(
    () => formatActionResponseErrors(state),
    [state]
  );

  return (
    <div className="border-black/20 border-t">
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        className={`flex min-h-12 w-full items-center justify-between gap-4 py-1 text-left hover:opacity-70 ${
          isExpanded ? '' : 'border-black/20 border-b'
        }`}
      >
        <span className="text-foreground text-[16px] leading-tight font-[400]">
          Password
        </span>
        {!isExpanded ? (
          <span className="text-foreground text-[16px] leading-tight font-[400]">
            Update Password
          </span>
        ) : null}
      </button>

      {isExpanded ? (
        <form action={updateUserAction} className="space-y-6 py-5">
          <PasswordField
            id="current-password"
            label="Current Password"
            name="currentPassword"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrentPassword}
            toggleShow={() => setShowCurrentPassword((previous) => !previous)}
          />

          <PasswordField
            id="new-password"
            label="New Password"
            name="newPassword"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPassword}
            toggleShow={() => setShowNewPassword((previous) => !previous)}
            error={newPasswordError}
          />

          <PasswordField
            id="confirm-new-password"
            label="Confirm New Password"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={setConfirmNewPassword}
            show={showConfirmNewPassword}
            toggleShow={() =>
              setShowConfirmNewPassword((previous) => !previous)
            }
            error={confirmPasswordError || validationError}
          />

          {actionErrors.length > 0 ? (
            <div>
              {actionErrors.map((error) => (
                <p
                  key={error}
                  className="text-right text-[14px] leading-tight font-[400] text-[#ff4d00]"
                >
                  {error}
                </p>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-black px-8 py-3 text-[16px] leading-none font-[400] text-white disabled:cursor-not-allowed disabled:bg-black/30"
            >
              Save
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
