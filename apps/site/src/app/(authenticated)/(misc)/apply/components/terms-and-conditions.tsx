// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AccountAgreementConfirmation from '@/app/(authenticated)/components/account-agreement/account-agreement-confirmation';
import AccountAgreementContent from '@/app/(authenticated)/components/account-agreement/account-agreement-content';
import { Button } from '@/components/ui';
import { submitApplication } from '../actions';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { ApplicationContext } from './application-tabs';

/** The time required to wait to press the submit application button in the modal. */
const waitTime = 5000;

/** Terms and conditions page */
export default function TermsAndConditions() {
  const { canSubmitApplication, farmSubscription, setCurrentTab, canEditFarm } =
    useContext(ApplicationContext);
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
        <AccountAgreementContent />
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
      <AccountAgreementConfirmation
        disabled={!canEditFarm || !canSubmitApplication}
        waitTimeMs={waitTime}
        onConfirm={async () => {
          await submitApplication();
          router.push('/application-success');
        }}
        onError={() => setSubmitError(true)}
      />
    </div>
  );
}
