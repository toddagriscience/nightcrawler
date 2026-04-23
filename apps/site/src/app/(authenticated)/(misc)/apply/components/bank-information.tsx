// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

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
import { useCallback, useContext, useMemo, useState } from 'react';
import { createAchSetupIntent, recordAchSetupComplete } from '../actions';
import { ApplicationContext } from './application-tabs';

const stripePromise = getStripeJsClient();

/** Statuses on `farmSubscription` that indicate bank info has been provided. */
const BANK_READY_STATUSES = [
  'bank_setup_complete',
  'active',
  'trialing',
] as const;

/** Visual tweaks for Stripe Elements to match the surrounding form. */
const elementsAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: 'inherit',
    colorPrimary: '#111111',
    borderRadius: '6px',
  },
};

/** The 4th tab in the application: collects ACH bank information.
 *
 * Uses Stripe Elements in setup mode (a SetupIntent with
 * `payment_method_types: ['us_bank_account']`) so the client can be billed
 * later without being charged or subscribed today.
 */
export default function BankInformation() {
  const { farmSubscription, setCurrentTab, canEditFarm } =
    useContext(ApplicationContext);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const hasBankSetup = useMemo(
    () =>
      BANK_READY_STATUSES.includes(
        (farmSubscription?.status ?? '') as (typeof BANK_READY_STATUSES)[number]
      ),
    [farmSubscription?.status]
  );

  const beginSetup = useCallback(async () => {
    setInitError(null);
    setIsInitializing(true);
    try {
      const result = await createAchSetupIntent();
      if (!result.data?.clientSecret || !result.data?.setupIntentId) {
        setInitError('Unable to start bank information setup right now.');
        return;
      }
      setClientSecret(result.data.clientSecret as string);
      setSetupIntentId(result.data.setupIntentId as string);
    } catch (error) {
      setInitError(
        formatActionResponseErrors(error)[0] ??
          'Unable to start bank information setup right now.'
      );
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const elementsOptions: StripeElementsOptions | null = clientSecret
    ? { clientSecret, appearance: elementsAppearance }
    : null;

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
        <p className="text-foreground/80 text-normal mt-2 italic">
          Bank details are stored with Stripe and can be updated from your
          account page at any time.
        </p>
      </div>

      {hasBankSetup ? (
        <div className="space-y-4 rounded-md border border-emerald-400/60 bg-emerald-50 p-6">
          <p className="text-sm text-emerald-800">
            Bank information on file. You can continue to the Terms tab to
            submit your application.
          </p>
          <Button
            type="button"
            className="bg-foreground text-background hover:bg-foreground/80 h-11 w-[225px] rounded-full text-sm font-semibold hover:cursor-pointer"
            onClick={() => {
              setCurrentTab('terms');
              scrollTo(0, 0);
            }}
          >
            Continue to Terms
          </Button>
        </div>
      ) : (
        <div className="space-y-5 rounded-md border border-[#848484]/80 p-8 pb-10">
          {initError && (
            <p className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700">
              {initError}
            </p>
          )}

          {!clientSecret && (
            <div className="flex flex-col gap-4">
              <p className="text-foreground/80 text-normal">
                Connect your bank account via Stripe to continue. No payment
                will be collected.
              </p>
              <Button
                type="button"
                className="bg-foreground text-background hover:bg-foreground/80 h-11 w-[225px] rounded-full text-sm font-semibold hover:cursor-pointer"
                onClick={beginSetup}
                disabled={!canEditFarm || isInitializing}
              >
                {isInitializing ? 'Preparing…' : 'Add Bank Information'}
              </Button>
            </div>
          )}

          {clientSecret && elementsOptions && setupIntentId && (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <BankSetupForm setupIntentId={setupIntentId} />
            </Elements>
          )}
        </div>
      )}
    </div>
  );
}

/** Inner form rendered inside `<Elements>` that confirms the SetupIntent. */
function BankSetupForm({ setupIntentId }: { setupIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const { error: confirmError, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/apply`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(
        confirmError.message ??
          'We could not verify your bank information. Please try again.'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await recordAchSetupComplete(setupIntent?.id ?? setupIntentId);
      // A soft reload lets the server-rendered apply page pick up the new
      // `farmSubscription` status without a client-side state split brain.
      window.location.reload();
    } catch (recordError) {
      setError(
        formatActionResponseErrors(recordError)[0] ??
          'We could not save your bank information. Please try again.'
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement
        options={{
          paymentMethodOrder: ['us_bank_account'],
          fields: { billingDetails: 'auto' },
        }}
      />

      {error && (
        <p className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="bg-foreground text-background hover:bg-foreground/80 h-11 w-[225px] rounded-full text-sm font-semibold hover:cursor-pointer"
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? 'Saving…' : 'Save Bank Information'}
      </Button>
    </form>
  );
}
