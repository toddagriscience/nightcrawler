// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

/** Reusable agreement confirmation and submit flow. */
export default function AccountAgreementConfirmation({
  disabled = false,
  onConfirm,
  onError = () => {},
  triggerButtonText = 'Agree',
  triggerClassName = '',
  submitButtonText = 'Agree and submit',
  waitTimeMs = 3000,
  dialogTitle = 'Are you sure you want to submit?',
  dialogBody = 'By submitting, you are finalizing your application and agreeing to the terms of service.',
  dialogCaution = 'You will not be able to edit your application or resubmit it after you\u2019ve submitted it.',
}: {
  disabled?: boolean;
  onConfirm: () => Promise<void>;
  onError?: () => void;
  triggerButtonText?: string;
  /** Extra classes for the trigger button, e.g. to size it like sibling step buttons instead of full width. */
  triggerClassName?: string;
  submitButtonText?: string;
  waitTimeMs?: number;
  dialogTitle?: string;
  dialogBody?: string;
  dialogCaution?: string;
}) {
  const { handleSubmit } = useForm();
  const [finalSubmitDisabled, setFinalSubmitDisabled] = useState(true);

  async function submit() {
    try {
      await onConfirm();
    } catch {
      onError();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className={cn(
            'w-full bg-black text-white hover:cursor-pointer hover:bg-black/80',
            triggerClassName
          )}
          disabled={disabled}
          onClick={() => {
            if (disabled) {
              return;
            }

            setFinalSubmitDisabled(true);
            setTimeout(() => setFinalSubmitDisabled(false), waitTimeMs);
          }}
        >
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription hidden>{dialogBody}</DialogDescription>
        </DialogHeader>
        <p>{dialogBody}</p>
        {dialogCaution && <p>{dialogCaution}</p>}
        <DialogClose asChild>
          <form onSubmit={handleSubmit(submit)}>
            <SubmitButton
              buttonText={submitButtonText}
              disabled={finalSubmitDisabled}
            />
          </form>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
