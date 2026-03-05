// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';
import { ApplicationContext } from './application-tabs';
import { createStripeSubscriptionCheckoutSession } from '../actions';

/** The 4th tab in the application page for starting the Stripe subscription. */
export default function Subscription() {
  const { farmSubscription, setCurrentTab } = useContext(ApplicationContext);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasActiveSubscription = useMemo(
    () => ['active', 'trialing'].includes(farmSubscription?.status ?? ''),
    [farmSubscription?.status]
  );

  const paymentResult = searchParams.get('subscription');

  async function beginStripeCheckout() {
    setError(null);
    setIsLoading(true);

    const result = await createStripeSubscriptionCheckoutSession();
    if (result.error || !result.data?.url) {
      setError(
        typeof result.error === 'string'
          ? result.error
          : 'Unable to start Stripe checkout right now.'
      );
      setIsLoading(false);
      return;
    }

    window.location.assign(result.data.url);
  }

  return (
    <div className="mt-6 flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Subscription Setup</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A monthly subscription is required before final application
          submission. Use Stripe to securely start your subscription.
        </p>
      </div>

      <div className="rounded-md border p-5">
        <p className="text-sm text-muted-foreground">Plan</p>
        <p className="text-xl font-semibold">Todd Internal Application</p>
        <p className="mt-1 text-sm">{'$2000/month'}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Status:{' '}
          <span className="font-medium text-foreground">
            {farmSubscription?.status ?? 'Not started'}
          </span>
        </p>
      </div>

      {paymentResult === 'success' && (
        <p className="rounded-md border border-emerald-400/60 bg-emerald-50 p-3 text-sm text-emerald-700">
          Payment flow completed in Stripe. Click refresh below to pull the
          latest subscription status.
        </p>
      )}

      {paymentResult === 'cancelled' && (
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
          Subscription checkout was cancelled before completion.
        </p>
      )}

      {hasActiveSubscription ? (
        <p className="rounded-md border border-emerald-400/60 bg-emerald-50 p-3 text-sm text-emerald-700">
          Subscription active. You can continue to terms and submit your
          application.
        </p>
      ) : (
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
          Subscription is not active yet. Complete checkout before continuing.
        </p>
      )}

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
          disabled={isLoading || hasActiveSubscription}
        >
          {hasActiveSubscription
            ? 'SUBSCRIPTION ACTIVE'
            : isLoading
              ? 'Start checkout'
              : `Start subscription`}
        </Button>

        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={() => router.refresh()}
        >
          REFRESH STATUS
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
          NEXT
        </Button>
      </div>
    </div>
  );
}
