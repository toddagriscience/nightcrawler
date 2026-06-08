// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/order/utils';
import type { SearchResultCardProps } from '../types';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 0.85],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
    },
  },
};

export function SearchResultCard({ result }: SearchResultCardProps) {
  const href =
    result.resultType === 'seed'
      ? `/product/${result.slug}`
      : `/imp/${result.slug}`;

  return (
    <motion.div variants={cardVariants} layout>
      <Link href={href} className="block group">
        <Card className="bg-card p-6 transition-shadow hover:shadow-md">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
              {result.category}
            </span>
            <span className="text-muted-foreground/30" aria-hidden>
              ·
            </span>
            <span
              className={`text-xs uppercase tracking-[0.12em] font-medium ${
                result.resultType === 'seed'
                  ? 'text-foreground/60'
                  : 'text-foreground/60'
              }`}
            >
              {result.resultType === 'seed' ? 'Seed' : 'IMP'}
            </span>
            {result.source && (
              <>
                <span className="text-muted-foreground/30" aria-hidden>
                  ·
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.source}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-normal text-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-200 tracking-tight">
            {result.title}
          </h2>

          {/* Price line for seeds */}
          {result.resultType === 'seed' &&
            result.priceInCents !== null &&
            result.unit && (
              <p className="text-sm text-muted-foreground mb-3 font-normal">
                {formatPrice(result.priceInCents)} / {result.unit}
                {typeof result.stock === 'number'
                  ? ` · ${result.stock} in stock`
                  : ''}
              </p>
            )}

          {/* Content excerpt */}
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground font-normal">
            {result.content}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}
