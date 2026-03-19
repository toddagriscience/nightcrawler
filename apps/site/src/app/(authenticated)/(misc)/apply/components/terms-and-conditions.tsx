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
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { ApplicationContext } from './application-tabs';

/** The time required to wait to press the submit application button in the modal. */
const waitTime = 5000;

/** Terms and conditions page */
export default function TermsAndConditions() {
  const { canSubmitApplication, farmSubscription, setCurrentTab, canEditFarm } =
    useContext(ApplicationContext);
  const { handleSubmit } = useForm();
  const [finalSubmitDisabled, setFinalSubmitDisabled] = useState(true);
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();
  const hasActiveSubscription = ['active', 'trialing'].includes(
    farmSubscription?.status ?? ''
  );

  if (!hasActiveSubscription) {
    return (
      <div className="mt-12 rounded-md border border-amber-400/60 bg-amber-50 p-4 text-amber-800">
        <p className="text-sm">
          Your payment information has not been added yet.
        </p>
        <Button
          type="button"
          className="mt-4"
          onClick={() => {
            setCurrentTab('subscription');
            scrollTo(0, 0);
          }}
        >
          Add your payment information
        </Button>
      </div>
    );
  }

  async function onSubmit() {
    try {
      await submitApplication();
      router.push('/application-success');
    } catch (error) {
      setSubmitError(true);
    }
  }

  return (
    <div>
      {submitError && (
        <p className="mt-12 text-center text-red-500">
          There was an error submitting your application.
        </p>
      )}
      <div className="mt-12 mb-6 flex w-full max-w-300 flex-col gap-4 font-light">
        {!canEditFarm && (
          <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
            Your account is read only. Only administrators can submit the
            application.
          </p>
        )}
        <h2 className="text-xl font-medium">
          Electronic Delivery of Documents
        </h2>
        <p>
          By tapping or clicking the “Agree” button below, you agree that you
          accept electronic delivery of the following documents, and that you
          have carefully reviewed and agree to the terms of each and will retain
          copies for your records:
        </p>

        <ul>
          <li className="underline">
            {/** TODO */}
            <Link href={'/apply'}>Statement of Additional Information</Link>
          </li>
          <li className="underline">
            <Link href={'/en/terms'}>Terms of Use</Link>
          </li>
          <li className="underline">
            <Link href={'/en/privacy'}>Privacy Policy</Link>
          </li>
        </ul>

        <p>
          The documents listed above, in addition to the Account Terms and
          Conditions below, constitute the “Application Agreement.” Capitalized,
          undefined terms in this Application Agreement have the meaning given
          in the
        </p>
        <h2 className="text-xl font-medium">Account Terms and Conditions.</h2>

        <h3 className="font-medium">You represent and warrant that:</h3>
        <p>
          You are the person identified in this Account Application, and all of
          the information you have provided in this Account Application is
          accurate; Todd can rely on such information; and you agree to notify
          Todd promptly regarding any change in such information or
          circumstances which may jeopardize Agreement compliance.
        </p>

        <h3 className="font-medium">You agree that:</h3>
        <ul className="flex flex-col gap-4">
          <li>
            You consent to electronic delivery of all future account information
            as described in the Client Agreement.
          </li>
          <li>
            You will establish and maintain complete and adequate records
            concerning all aspects of farm operations and make such records
            available to Todd immediately upon request; you will comply with
            audits; and you consent to allow Todd or its authorized agents to
            access all facilities and documents, including non-production areas
            and facilities, at any reasonable time without prior notice.
          </li>
          <li>
            You authorize Todd to verify, and re-verify as necessary, all
            information provided in this Account Application to comply with
            regulatory obligations.
          </li>
          <li>
            You will comply with all local, regional, state, and federal laws
            and standards governing farm management, processing operations, and
            food safety, and you will not hold Todd responsible in the event any
            crop is found to be uncertifiable or contains residue of prohibited
            materials or toxic agents.
          </li>
        </ul>

        <p>
          Tapping or clicking the “Agree” button below is equivalent to your own
          written signature, and you understand that you are entering into legal
          agreements.
        </p>
        <p className="mb-6 text-sm font-light">
          You are about to finalize your Account Application. By clicking or
          tapping the “Agree” button below, you agree that you have read the
          Account Agreement which contains a predispute arbitration clause
          (Section 39) and you agree in advance to arbitrate any controversies
          which may arise between you and Todd in accordance with such Section
          39.
        </p>
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm">
          Important: once you accept and submit, you will not be able to edit
          your application or resubmit it.
        </p>
        {!canSubmitApplication && (
          <div className="flex flex-row items-center justify-between rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700">
            <p>
              Please complete General Business Information, Farm Information,
              and Platform License Setup before submitting your application.
            </p>
            <Button
              className="h-min p-0 hover:cursor-pointer"
              onClick={() => router.refresh()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
            disabled={!canEditFarm || !canSubmitApplication}
            onClick={() => {
              if (!canEditFarm || !canSubmitApplication) {
                return;
              }
              setTimeout(() => setFinalSubmitDisabled(false), waitTime);
            }}
          >
            Agree
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
            You will not be able to edit your application or resubmit it after
            you&apos;ve submitted it.
          </p>
          <DialogClose asChild>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SubmitButton
                buttonText="Agree and submit"
                disabled={finalSubmitDisabled}
              />
            </form>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
