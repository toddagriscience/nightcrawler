// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';
import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

/** A submit button with a spinner. Must be wrapped with a form. Uses `useFormStatus()` to monitor the status of the form.
 *
 * @param {string} buttonText - The content in the button itself.
 * @param {string} className - Extra styling. This component comes with default styling and uses ShadCN's button component however.
 * @param {function} onClickFunction - The callback that is called when the button is clicked. Optional.
 * @param {boolean} disabled - Externally change if the button is disabled. The exact logic that is used is `disabled || pending`. Pending is acquired from `useFormStatus()`. Optional.
 * @param {number} cooldownTime - The amount of time, in seconds, that the user has to wait before submitting again. Defaults to 10 seconds. This parameter being provided does not "activate" the cooldown functionality. See the `cooldownClickHandler` parameter for that.
 * @param {function} cooldownClickHandler - If provided, forces the button to have a cooldown (default 10 seconds, see `cooldownTime`). This function is called if the button is clicked during the cooldown period.
 * @param {function} sendCooldownTime - Sends the exact time that the cooldown started. Helps with calculating amount of time to display an error message.
 * @param {boolean} reactHookFormPending - For cross compatability with React Hook Form. `useFormStatus()` doesn't work with React Hook Form, consequently this acts as a drop in for the loading state.
 *
 * @returns {JSX.Element} - The submit button component. */
export default function SubmitButton({
  buttonText,
  className = '',
  onClickFunction = () => {},
  disabled = undefined,
  cooldownTime = 10,
  cooldownClickHandler = undefined,
  sendCooldownTime = undefined,
  reactHookFormPending = undefined,
}: {
  buttonText: string;
  className?: string;
  onClickFunction?(...args: unknown[]): unknown;
  disabled?: boolean;
  cooldownTime?: number;
  cooldownClickHandler?: () => void;
  sendCooldownTime?: (arg0: Date) => void;
  reactHookFormPending?: boolean;
}) {
  const { pending } = useFormStatus();
  const [cooldown, setCooldown] = useState(false);

  function handleClick() {
    onClickFunction();

    if (cooldownClickHandler != undefined) {
      if (cooldown) {
        cooldownClickHandler();
      } else {
        setCooldown(true);
        if (sendCooldownTime) {
          sendCooldownTime(new Date());
        }
        setTimeout(() => setCooldown(false), cooldownTime * 1000);
      }
    }
  }

  return (
    <Button
      className={
        'w-full bg-black text-white hover:cursor-pointer hover:bg-black/80 ' +
        className
      }
      type="submit"
      disabled={disabled || pending}
      onClick={handleClick}
    >
      {pending || reactHookFormPending ? (
        <Spinner className="mx-auto w-5 h-5" />
      ) : (
        buttonText
      )}
    </Button>
  );
}
