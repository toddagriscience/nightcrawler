// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { formatPrice } from '@/lib/order/utils';
import { getSeedProductBySlug } from './utils';
import { SeedOrderForm } from './components/seed-order-form';

/**
 * Authenticated seed product detail page.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await getAuthenticatedInfo();

  // Open platform access; farm.approved still used for ApplicationReviewBanner
  // and internal tooling. Old guard after getAuthenticatedInfo():
  // if (!currentUser.approved) {
  //   notFound();
  // }

  const { slug } = await params;
  const product = await getSeedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-light text-foreground/70 transition-colors hover:text-foreground"
        >
          <HiArrowLongLeft className="size-5" />
          Back to search
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_24rem]">
        <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="relative aspect-[16/9] bg-stone-100">
            <Image
              src={product.imageUrl || '/seed-placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-foreground/70">
                {product.stock} in stock
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-foreground/80">
                {product.description}
              </p>
            </div>
          </div>
        </article>

        <aside className="h-max rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-foreground/50">
                Cost per unit
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {formatPrice(product.priceInCents)}
                <span className="text-lg font-normal text-foreground/60">
                  {' '}
                  / {product.unit}
                </span>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-foreground/50">
                Supply / stock
              </p>
              <p className="mt-2 text-lg text-foreground">
                {product.stock} available
              </p>
            </div>

            {product.relatedImpSlug && product.relatedImpTitle ? (
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-foreground/50">
                  Related IMP
                </p>
                <Link
                  href={`/imp/${product.relatedImpSlug}`}
                  className="mt-2 inline-flex text-sm font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {product.relatedImpTitle}
                </Link>
              </div>
            ) : null}

            <SeedOrderForm
              seedProductId={product.id}
              slug={product.slug}
              name={product.name}
              description={product.description}
              stock={product.stock}
              imageUrl={product.imageUrl ?? null}
              unit={product.unit}
              priceInCents={product.priceInCents}
            />

            <Button asChild variant="outline" className="w-full">
              <Link href={product.advisorContactUrl || '/contact'}>
                Contact an advisor
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
