// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import Image from 'next/image';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { getAllSeedProducts } from './db';
import { formatPrice } from '@/lib/order/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seeds | Todd',
};

export default async function SeedsPage() {
  await getAuthenticatedInfo();
  const products = await getAllSeedProducts();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Seed Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse available seed products for your operation.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No seed products available yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] transition-all hover:border-[var(--border-strong)] hover:shadow-md"
            >
              <div className="relative aspect-[16/9] bg-stone-100">
                <Image
                  src={product.imageUrl || '/seed-placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(product.priceInCents)}
<span className="text-xs font-normal text-muted-foreground">
                      {' '}/ {product.unit}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.stock} avail
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
