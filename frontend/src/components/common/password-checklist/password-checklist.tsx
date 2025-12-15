// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PasswordRequirements } from '@/lib/types/auth';
import { useEffect, useMemo, useState } from 'react';

/** A password checklist that updates based off of what password the user has entered.
 *
 * @param {string} password - The current password
 * @param {string} className - Any extra classes for the main div
 * @returns {JSX.Element} - A password checklist*/
export default function PasswordChecklist({
  password,
  confirmationPassword,
  className = '',
  setIsPasswordValid,
}: {
  password: string;
  confirmationPassword: string;
  className?: string;
  setIsPasswordValid?: (arg0: boolean) => unknown;
}) {
  const innerPasswordRequirements = useMemo(
    () => ({
      has8Characters: password.length >= 8,
      hasSpecialCharacter: /[^A-Za-z0-9]/.test(password),
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      isConfirmationSame: password === confirmationPassword,
    }),
    [password, confirmationPassword]
  );

  const [passwordRequirements] = useState<PasswordRequirements>(
    () => innerPasswordRequirements
  );

  useEffect(() => {
    if (setIsPasswordValid) {
      if (
        innerPasswordRequirements.has8Characters &&
        innerPasswordRequirements.hasSpecialCharacter &&
        innerPasswordRequirements.hasNumber &&
        innerPasswordRequirements.hasUpperCase &&
        innerPasswordRequirements.isConfirmationSame
      ) {
        setIsPasswordValid(true);
      } else {
        setIsPasswordValid(false);
      }
    }
  }, [
    password,
    confirmationPassword,
    setIsPasswordValid,
    innerPasswordRequirements,
  ]);

  return (
    <div className={`${className}`}>
      <p className="mb-4">
        Please make sure to use a secure password matching the rules.
      </p>
      <ul>
        <li
          className={
            passwordRequirements.has8Characters
              ? 'text-green-500'
              : 'text-red-500'
          }
        >
          {passwordRequirements.has8Characters ? '✓' : '✗'} at least 8
          characters
        </li>

        <li
          className={
            passwordRequirements.hasSpecialCharacter
              ? 'text-green-500'
              : 'text-red-500'
          }
        >
          {passwordRequirements.hasSpecialCharacter ? '✓' : '✗'} contains a
          special character (~!@#$%^&amp;*-_;:)
        </li>

        <li
          className={
            passwordRequirements.hasNumber ? 'text-green-500' : 'text-red-500'
          }
        >
          {passwordRequirements.hasNumber ? '✓' : '✗'} contains a number
        </li>

        <li
          className={
            passwordRequirements.hasUpperCase
              ? 'text-green-500'
              : 'text-red-500'
          }
        >
          {passwordRequirements.hasUpperCase ? '✓' : '✗'} contains an uppercase
          letter
        </li>
        <li
          className={
            passwordRequirements.isConfirmationSame
              ? 'text-green-500'
              : 'text-red-500'
          }
        >
          {passwordRequirements.isConfirmationSame ? '✓' : '✗'} both passwords
          are the same
        </li>
      </ul>
    </div>
  );
}
