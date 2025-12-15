// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';
import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { useFormStatus } from 'react-dom';

/** A submit button with a spinner. Must be wrapped with a form. Uses `useFormStatus()` to monitor the status of the form.
 *
 * @param {string} buttonText - The content in the button itself.
 * @param {string} className - Extra styling. This component comes with default styling and uses ShadCN's button component however.
 * @returns {JSX.Element} - The submit button component. */
export default function SubmitButton({
  buttonText,
  className = '',
  onClickFunction = () => {},
  disabled = undefined,
}: {
  buttonText: string;
  className?: string;
  onClickFunction?(...args: unknown[]): unknown;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={
        'w-full bg-black text-white hover:cursor-pointer hover:bg-black/80 ' +
        className
      }
      type="submit"
      disabled={disabled || pending}
      onClick={onClickFunction}
    >
      {pending ? <Spinner className="mx-auto w-5 h-5" /> : buttonText}
    </Button>
  );
}
