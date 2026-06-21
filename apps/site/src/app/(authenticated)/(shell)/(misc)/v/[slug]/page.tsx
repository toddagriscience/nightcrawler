// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/order/utils';
import { requirePlatformOnboardingComplete } from '@/lib/utils/platform-onboarding';
import { statusMeta } from '../format';
import { getVarietyBySlug } from './utils';

/** Authenticated variety detail page. */
export default async function VarietyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requirePlatformOnboardingComplete();

  const { slug } = await params;
  const variety = await getVarietyBySlug(slug);

  if (!variety) {
    notFound();
  }

  const { label: statusLabel, className: statusClassName } = statusMeta(
    variety.status
  );
  const isReference = variety.status === 'reference';

  const prices = [
    { label: 'Per oz', cents: variety.pricePerOzCents },
    { label: 'Per lb', cents: variety.pricePerLbCents },
    { label: 'Per plant', cents: variety.pricePerPlantCents },
  ];

  const meta = [
    variety.cropName,
    variety.lastProduced ? `last produced ${variety.lastProduced}` : null,
    variety.location,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Link
        href="/v"
        className="inline-flex items-center gap-2 text-sm font-light text-foreground/70 transition-colors hover:text-foreground"
      >
        <HiArrowLongLeft className="size-5" />
        All varieties
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {variety.name}
        </h1>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClassName}`}
        >
          {statusLabel}
        </span>
      </div>
      {meta ? <p className="mt-2 text-sm text-foreground/50">{meta}</p> : null}

      {variety.description ? (
        <p className="mt-6 text-base leading-relaxed text-foreground/80">
          {variety.description}
        </p>
      ) : null}

      {variety.cropDescription ? (
        <section className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">
            Growing info
          </h2>
          <p className="mt-2 text-base leading-relaxed text-foreground/80">
            {variety.cropDescription}
          </p>
        </section>
      ) : null}

      {!isReference ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">
              Pricing
            </h2>
            <dl className="mt-2 text-sm">
              {prices.map((p) => (
                <div
                  key={p.label}
                  className="flex justify-between border-b border-stone-100 py-2"
                >
                  <dt className="text-foreground/60">{p.label}</dt>
                  <dd className="text-foreground">
                    {p.cents != null ? formatPrice(p.cents) : '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {variety.inventoryNote ? (
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Inventory
              </h2>
              <p className="mt-2 text-sm text-foreground/80">
                {variety.inventoryNote}
              </p>
            </section>
          ) : null}
        </div>
      ) : null}

      {!isReference ? (
        <section className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-medium text-foreground">
            Request this variety
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Seed requests are handled by a Todd advisor — reach out with the
            variety and amount you need.
          </p>
          <Button asChild className="mt-4">
            <Link href="/contact">Request through an advisor</Link>
          </Button>
        </section>
      ) : (
        <p className="mt-8 text-sm text-foreground/50">
          Historical reference — not currently part of the requestable
          inventory.
        </p>
      )}
    </div>
  );
}
