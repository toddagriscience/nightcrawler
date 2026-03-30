// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AccountAgreementConfirmation from '@/app/(authenticated)/components/account-agreement/account-agreement-confirmation';
import AccountAgreementContent from '@/app/(authenticated)/components/account-agreement/account-agreement-content';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { acceptAccountAgreement } from '../actions';

/** Renders agreement content and submit flow for viewer accounts. */
export default function AccountAgreementPageContent() {
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto mb-8 w-[90vw] max-w-[550px]">
      {submitError && (
        <p className="mt-12 text-center text-red-500">
          There was an error submitting your agreement.
        </p>
      )}
      <div className="mt-12 mb-6 flex w-full max-w-300 flex-col gap-4 font-light">
        <h1 className="text-2xl font-medium">Account Agreement</h1>
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm">
          You must accept this agreement before accessing the platform.
        </p>
        <AccountAgreementContent />
      </div>
      <AccountAgreementConfirmation
        waitTimeMs={2000}
        dialogTitle="Are you sure you want to agree?"
        dialogBody="By agreeing, you are accepting the account agreement and terms of service."
        dialogCaution=""
        onConfirm={async () => {
          await acceptAccountAgreement();
          router.refresh();
          router.push('/');
        }}
        onError={() => setSubmitError(true)}
      />
    </div>
  );
}
