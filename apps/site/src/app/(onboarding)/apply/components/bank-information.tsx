// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import type {
  BankInformationProps,
  BankSetupFormProps,
} from '@/app/(onboarding)/apply/components/types';
import { Button } from '@/components/ui';
import { getStripeJsClient } from '@/lib/stripe/public-client';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import Link from 'next/link';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const elementsAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: '"Neue Haas Unica", Arial, sans-serif',
    colorPrimary: '#111111',
    borderRadius: '6px',
  },
};

/** Collects bank details and requires a separate Continue to finish payment. */
export default function BankInformation({
  renderSetupForm,
}: BankInformationProps) {
  const {
    actions,
    hasBankSetup,
    paymentContinued,
    canEditFarm,
    onBankSetupComplete,
    completePaymentStep,
    goBackToTeam,
    returnedSetupIntentId: serverReturnedSetupIntentId,
  } = useContext(ApplicationContext);
  const [ignoredReturnedIntentId, setIgnoredReturnedIntentId] = useState<
    string | null
  >(null);
  const returnedSetupIntentId =
    serverReturnedSetupIntentId === ignoredReturnedIntentId
      ? undefined
      : serverReturnedSetupIntentId;
  const [setup, setSetup] = useState<{
    clientSecret: string;
    setupIntentId: string;
    stripe: ReturnType<typeof getStripeJsClient> | null;
  } | null>(null);
  const [bankSaved, setBankSaved] = useState(false);
  const bankReady = hasBankSetup || bankSaved;
  const confirmationForm = useForm();
  const isConfirming = confirmationForm.formState.isSubmitting;
  const {
    handleSubmit: handleSetupSubmit,
    setError: setSetupError,
    clearErrors: clearSetupErrors,
    formState: { errors: setupErrors, isSubmitting: isInitializing },
  } = useForm();
  const {
    handleSubmit: handleRestoreSubmit,
    setError: setRestoreError,
    clearErrors: clearRestoreErrors,
    formState: { errors: restoreErrors, isSubmitting: isRestoring },
  } = useForm();
  const restoredIntent = useRef<string | null>(null);
  const restoreBankSetup = useCallback(async () => {
    if (
      !returnedSetupIntentId ||
      !canEditFarm ||
      hasBankSetup ||
      paymentContinued
    )
      return;
    clearRestoreErrors();
    try {
      await actions.recordAchSetupComplete(returnedSetupIntentId);
      setBankSaved(true);
      onBankSetupComplete();
    } catch (error) {
      setRestoreError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'We could not confirm your bank information. Please try again.',
      });
    }
  }, [
    returnedSetupIntentId,
    canEditFarm,
    hasBankSetup,
    paymentContinued,
    clearRestoreErrors,
    actions,
    onBankSetupComplete,
    setRestoreError,
  ]);

  useEffect(() => {
    if (
      !returnedSetupIntentId ||
      bankReady ||
      restoredIntent.current === returnedSetupIntentId
    )
      return;
    restoredIntent.current = returnedSetupIntentId;
    void handleRestoreSubmit(restoreBankSetup)();
  }, [returnedSetupIntentId, bankReady, handleRestoreSubmit, restoreBankSetup]);
  const {
    handleSubmit: handleNavigation,
    setError: setNavigationError,
    clearErrors: clearNavigationErrors,
    formState: { errors: navigationErrors, isSubmitting: isNavigating },
  } = useForm();

  const elementsOptions = useMemo<StripeElementsOptions | null>(() => {
    if (!setup) return null;
    return {
      clientSecret: setup.clientSecret,
      appearance: elementsAppearance,
      fonts: [
        { cssSrc: window.location.origin + '/fonts/stripe-elements.css' },
      ],
    };
  }, [setup]);

  async function beginSetup() {
    if (!canEditFarm || paymentContinued) return;
    clearSetupErrors();
    try {
      const result = await actions.createAchSetupIntent();
      if (
        typeof result.data?.clientSecret !== 'string' ||
        typeof result.data?.setupIntentId !== 'string'
      ) {
        throw new Error('Unable to start bank information setup right now.');
      }
      setSetup({
        clientSecret: result.data.clientSecret,
        setupIntentId: result.data.setupIntentId,
        stripe: renderSetupForm ? null : getStripeJsClient(),
      });
    } catch (error) {
      setSetupError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'Unable to start bank information setup right now.',
      });
    }
  }

  async function navigate(direction: 'back' | 'continue') {
    if (
      !canEditFarm ||
      paymentContinued ||
      isConfirming ||
      isRestoring ||
      isInitializing
    )
      return;
    if (direction === 'continue' && !bankReady) return;
    clearNavigationErrors();
    try {
      if (direction === 'back') await goBackToTeam();
      else await completePaymentStep();
    } catch (error) {
      setNavigationError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'Unable to save your progress. Please try again.',
      });
    }
  }

  function handleBankSaved() {
    setBankSaved(true);
    onBankSetupComplete();
  }

  return (
    <div className="mt-6 flex max-w-3xl flex-col gap-6">
      {!canEditFarm && (
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
          Your account is read only. Only administrators can manage bank
          information.
        </p>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Bank Information</h2>
        <p className="text-foreground/80 text-normal mt-4">
          Securely connect the bank account you would use for ACH payments if
          you later decide to work with us as a paid client. We will
          <strong>&nbsp;not&nbsp;</strong>
          charge or subscribe you now—your account will remain free once your
          application is approved.
        </p>
        <p className="text-foreground/80 text-normal mt-2">
          You&apos;ll be asked to sign in to your bank in a secure pop-up so we
          can verify the account instantly. If your bank isn&apos;t available,
          please{' '}
          <Link className="underline" href="/contact">
            contact us
          </Link>{' '}
          and we&apos;ll help you finish your application.
        </p>
        <p className="text-foreground/80 text-normal mt-2 italic">
          Bank details are stored with Stripe and can be updated from your
          account page at any time.
        </p>
      </div>

      {bankReady ? (
        <p
          role="status"
          className="rounded-md border border-emerald-400/60 bg-emerald-50 p-6 text-sm text-emerald-800"
        >
          Bank information on file. Continue to review and accept the terms.
        </p>
      ) : (
        <div className="space-y-5 rounded-md border border-[#848484]/80 p-8 pb-10">
          {setupErrors.root?.message && (
            <p
              role="alert"
              className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700"
            >
              {setupErrors.root.message}
            </p>
          )}
          {returnedSetupIntentId && (
            <form
              onSubmit={handleRestoreSubmit(restoreBankSetup)}
              className="space-y-4"
              aria-busy={isRestoring}
            >
              <p className="text-sm">
                Confirm your connected bank account to continue.
              </p>
              {restoreErrors.root?.message && (
                <p role="alert" className="text-sm text-red-700">
                  {restoreErrors.root.message}
                </p>
              )}
              <Button type="submit" disabled={isRestoring || !canEditFarm}>
                {isRestoring
                  ? 'Confirming bank information…'
                  : 'Retry bank confirmation'}
              </Button>
              {restoreErrors.root?.message && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isRestoring || !canEditFarm}
                  onClick={() => {
                    setIgnoredReturnedIntentId(returnedSetupIntentId);
                    clearRestoreErrors();
                    void handleSetupSubmit(beginSetup)();
                  }}
                >
                  Start bank setup again
                </Button>
              )}
            </form>
          )}
          {!setup && !returnedSetupIntentId && (
            <form
              onSubmit={handleSetupSubmit(beginSetup)}
              className="flex flex-col gap-4"
            >
              <p className="text-foreground/80 text-normal">
                Connect your bank account via Stripe to continue. No payment
                will be collected.
              </p>
              <Button
                type="submit"
                className="bg-foreground text-background hover:bg-foreground/80 h-11 w-[225px] rounded-full text-sm font-semibold hover:cursor-pointer"
                disabled={!canEditFarm || isInitializing || paymentContinued}
              >
                {isInitializing ? 'Preparing…' : 'Add Bank Information'}
              </Button>
            </form>
          )}
          {setup && elementsOptions && (
            <FormProvider {...confirmationForm}>
              {renderSetupForm ? (
                renderSetupForm({
                  setupIntentId: setup.setupIntentId,
                  onComplete: handleBankSaved,
                })
              ) : (
                <Elements stripe={setup.stripe} options={elementsOptions}>
                  <BankSetupForm
                    setupIntentId={setup.setupIntentId}
                    onComplete={handleBankSaved}
                  />
                </Elements>
              )}
            </FormProvider>
          )}
        </div>
      )}

      {!paymentContinued && (
        <form
          onSubmit={handleNavigation(() => navigate('continue'))}
          className="space-y-4"
          aria-busy={isNavigating}
        >
          {navigationErrors.root?.message && (
            <p role="alert" className="text-sm text-red-700">
              {navigationErrors.root.message}
            </p>
          )}
          <p className="text-foreground/80 text-sm">
            After you continue, you will not be able to return to Add people or
            Payment during onboarding.
          </p>
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-6"
              disabled={
                !canEditFarm ||
                isNavigating ||
                isInitializing ||
                isRestoring ||
                isConfirming
              }
              onClick={() => void handleNavigation(() => navigate('back'))()}
            >
              Back to Add people
            </Button>
            <Button
              type="submit"
              className="h-11 w-[200px] rounded-full bg-black font-semibold text-white hover:bg-black/80"
              disabled={!canEditFarm || !bankReady || isNavigating}
            >
              Continue
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function BankSetupForm({ setupIntentId, onComplete }: BankSetupFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [confirmedIntentId, setConfirmedIntentId] = useState<string | null>(
    null
  );
  const { actions, canEditFarm, paymentContinued } =
    useContext(ApplicationContext);
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useFormContext();

  async function submit() {
    if (!stripe || !elements || !canEditFarm || paymentContinued) return;
    clearErrors();
    try {
      let intentToRecord = confirmedIntentId;
      if (!intentToRecord) {
        const { error: confirmError, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: { return_url: window.location.origin + '/apply' },
          redirect: 'if_required',
        });
        if (confirmError) {
          const message = confirmError.message;
          const unsupported = [
            'financial connections',
            'not supported',
            'institution',
            'unavailable',
          ].some((term) => message?.toLowerCase().includes(term));
          throw new Error(
            message
              ? unsupported
                ? message +
                  " If this keeps happening, please contact us and we'll finish your application together."
                : message
              : 'We could not verify your bank information. If your bank is not supported, please contact us and we will help finish your application.'
          );
        }
        intentToRecord = setupIntent?.id ?? setupIntentId;
        setConfirmedIntentId(intentToRecord);
      }
      await actions.recordAchSetupComplete(intentToRecord);
      onComplete();
    } catch (error) {
      setError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'We could not save your bank information. Please try again.',
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-6"
      aria-busy={isSubmitting}
    >
      {confirmedIntentId ? (
        <p className="text-sm">
          Your bank is connected. Save the confirmation to continue.
        </p>
      ) : (
        <PaymentElement
          options={{
            paymentMethodOrder: ['us_bank_account'],
            fields: { billingDetails: 'auto' },
          }}
        />
      )}
      {errors.root?.message && (
        <p
          role="alert"
          className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700"
        >
          {errors.root.message}
        </p>
      )}
      <Button
        type="submit"
        className="bg-foreground text-background hover:bg-foreground/80 h-11 w-[225px] rounded-full text-sm font-semibold hover:cursor-pointer"
        disabled={
          !stripe ||
          !elements ||
          !canEditFarm ||
          paymentContinued ||
          isSubmitting
        }
      >
        {isSubmitting
          ? 'Saving…'
          : confirmedIntentId
            ? 'Retry bank confirmation'
            : 'Save Bank Information'}
      </Button>
    </form>
  );
}
