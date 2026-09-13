// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AccountAgreementConfirmation from '@/app/(authenticated)/components/account-agreement/account-agreement-confirmation';
import AccountAgreementContent from '@/app/(authenticated)/components/account-agreement/account-agreement-content';
import { Button } from '@/components/ui';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';

/** The time required to wait to press the submit application button in the modal. */
const waitTime = 5000;

/** Final agreement step, available only after the payment Continue is saved. */
export default function TermsAndConditions() {
  const {
    canSubmitApplication,
    hasBankSetup,
    paymentContinued,
    canEditFarm,
    actions,
  } = useContext(ApplicationContext);
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();
  if (!hasBankSetup || !paymentContinued) {
    return (
      <div className="mt-12 rounded-md border border-amber-400/60 bg-amber-50 p-4 text-amber-800">
        <p role="alert" className="text-sm">
          {paymentContinued
            ? 'We could not confirm your saved bank information. Refresh your application or contact support for help.'
            : 'Complete the payment step before accepting the terms.'}
        </p>
        {paymentContinued && (
          <Button
            type="button"
            className="mt-4"
            onClick={() => router.refresh()}
          >
            Refresh application status
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      {submitError && (
        <p role="alert" className="mt-12 text-center text-red-500">
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
              We could not confirm your onboarding progress. Refresh your
              application to try again.
            </p>
            <Button
              variant="ghost"
              type="button"
              aria-label="Refresh application status"
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
          setSubmitError(false);
          await actions.submitApplication();
          router.push('/');
        }}
        onError={() => setSubmitError(true)}
      />
    </div>
  );
}
