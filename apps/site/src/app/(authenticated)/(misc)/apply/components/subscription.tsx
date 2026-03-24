// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useRouter } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';
import { createStripeSubscriptionCheckoutSession } from '../actions';
import { ApplicationContext } from './application-tabs';

/** The 4th tab in the application page for starting the Stripe Platform License. */
export default function Subscription() {
  const { farmSubscription, setCurrentTab, canEditFarm } =
    useContext(ApplicationContext);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const hasActiveSubscription = useMemo(
    () => ['active', 'trialing'].includes(farmSubscription?.status ?? ''),
    [farmSubscription?.status]
  );

  async function beginStripeCheckout() {
    setError(null);
    setIsLoading(true);
    try {
      const result = await createStripeSubscriptionCheckoutSession();
      if (!result.data?.url) {
        setError('Unable to start Stripe checkout right now.');
        setIsLoading(false);
        return;
      }

      window.location.assign(result.data.url);
    } catch (error) {
      setError(
        formatActionResponseErrors(error)[0] ??
          'Unable to start Stripe checkout right now.'
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6 flex max-w-3xl flex-col gap-6">
      {!canEditFarm && (
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
          Your account is read only. Only administrators can manage the Platform
          License.
        </p>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Activate Your Todd Partnership
        </h2>
        <p className="text-foreground/80 mt-4 text-normal">
          To complete your application, please provide payment information for
          your Platform License. Checkout is provided securely through Stripe.
        </p>
        <p className="text-foreground/80 mt-2 text-normal italic">
          Billing will start after the 7 day grace period.
        </p>
      </div>

      <div className="space-y-5 rounded-md border p-8 pb-10 border-[#848484]/80">
        <p className="text-xl font-semibold mb-6">Todd Agriscience</p>
        <p className="text-foreground/80 text-normal">
          {'$1,695.00 per month'}
        </p>
        {hasActiveSubscription ? (
          <p className="rounded-md border border-emerald-400/60 bg-emerald-50 p-3 text-sm text-emerald-700">
            Platform License active. You can continue to Terms and submit your
            application.
          </p>
        ) : (
          <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
            Platform License not active yet. Complete checkout to continue.
          </p>
        )}

        <Button
          type="button"
          className="h-11 w-[225px] rounded-full text-sm hover:cursor-pointer hover:bg-foreground/80 bg-foreground text-background font-semibold mt-4"
          onClick={beginStripeCheckout}
          disabled={!canEditFarm || isLoading || hasActiveSubscription}
        >
          {hasActiveSubscription
            ? 'Platform License Active'
            : isLoading
              ? 'Opening Checkout'
              : 'Start Secure Checkout'}
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-12 mt-4 mx-1">
        <div className="flex flex-row items-baseline ml-2">
          <p className="text-base font-semibold">Already paid?</p>
          <Button
            type="button"
            className="w-35 h-6 text-sm hover:cursor-pointer hover:underline font-semibold bg-transparent text-foreground/80"
            variant="default"
            onClick={() => router.refresh()}
          >
            Refresh Status Here
          </Button>
        </div>
        <Button
          type="button"
          className="h-11 w-[225px] rounded-full text-sm hover:cursor-pointer bg-foreground text-background font-semibold"
          onClick={() => {
            setCurrentTab('terms');
            scrollTo(0, 0);
          }}
          disabled={!hasActiveSubscription}
        >
          Continue to Terms
        </Button>
      </div>
    </div>
  );
}
