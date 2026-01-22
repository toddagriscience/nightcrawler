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
import { useForm } from 'react-hook-form';
import { submitApplication } from '../actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** The time required to wait to press the submit application button in the modal. */
const waitTime = 5000;

/** Terms and conditions page */
export default function TermsAndConditions() {
  const { handleSubmit } = useForm();
  const [finalSubmitDisabled, setFinalSubmitDisabled] = useState(true);
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    try {
      const result = await submitApplication();

      if (result.error) {
        setSubmitError(true);
      } else {
        router.push('/application-success');
      }
    } catch (error) {
      setSubmitError(true);
    }
  }

  return (
    <div>
      {submitError && (
        <p className="text-red-500 text-center mt-12">
          There was an error submitting your application.
        </p>
      )}
      <h1 className="text-3xl text-center mb-6 mt-12">Terms and conditions</h1>
      <div className="w-full max-w-300 h-[90vh] mb-6">
        <iframe
          src={'/account-agreement.pdf#toolbar=0'}
          className="w-full h-full"
        ></iframe>
      </div>
      <p className="text-sm mb-6">
        You are about to finalize your Account Application. By clicking or
        tapping the “Agree” button below, you agree that you have read the
        Account Agreement which contains a predispute arbitration clause
        (Section 39) and you agree in advance to arbitrate any controversies
        which may arise between you and Todd in accordance with such Section 39.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
            onClick={() =>
              setTimeout(() => setFinalSubmitDisabled(false), waitTime)
            }
          >
            AGREE AND SUBMIT
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to submit?</DialogTitle>
            <DialogDescription hidden>
              By submitting, you are finalizing your application and agreeing to
              the terms of service.
            </DialogDescription>
          </DialogHeader>
          <p>
            By submitting, you are finalizing your application and agreeing to
            the terms of service.
          </p>
          <p>
            You will not be able to access your application after you&apos;ve
            submitted it.
          </p>
          <DialogClose asChild>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SubmitButton
                buttonText="AGREE AND SUBMIT"
                disabled={finalSubmitDisabled}
              />
            </form>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
