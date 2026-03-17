// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useRouter } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';
import { ApplicationContext } from './application-tabs';
import { createStripeSubscriptionCheckoutSession } from '../actions';

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
      <div>
        <h2 className="text-lg font-semibold">
          Activate Your Todd Partnership
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          To complete your application, please provide payment information for
          your Platform License. Checkout is provided securely through Stripe.{' '}
          <i>Billing will start after the 7 day grace period.</i>
        </p>
      </div>

      <div className="space-y-3 rounded-md border p-5">
        <p className="text-xl font-semibold">Todd Agriscience</p>
        <p className="text-sm">{'$1,695.00 per month'}</p>
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
      </div>

      {error && (
        <p className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-row gap-4 max-sm:flex-col">
        <Button
          type="button"
          className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
          onClick={beginStripeCheckout}
          disabled={!canEditFarm || isLoading || hasActiveSubscription}
        >
          {hasActiveSubscription
            ? 'Platform License Active'
            : isLoading
              ? 'Opening Checkout'
              : 'Start Secure Checkout'}
        </Button>

        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={() => router.refresh()}
        >
          Refresh Platform License Status
        </Button>

        <Button
          type="button"
          className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
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
