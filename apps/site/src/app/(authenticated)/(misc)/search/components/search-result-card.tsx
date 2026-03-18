// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { KnowledgeArticleSelect } from '@/lib/types/db';

interface SearchResultCardProps {
  result: KnowledgeArticleSelect;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <Link href={`/imp/${result.slug}`} className="block">
      <Card className="bg-white p-6 transition-colors hover:bg-stone-50">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-foreground/10 px-2 py-1 text-xs font-medium text-foreground/70">
            {result.category}
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium uppercase tracking-[0.12em] text-emerald-800">
            IMP
          </span>
          {result.source && (
            <span className="text-xs text-foreground/50">{result.source}</span>
          )}
        </div>
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          {result.title}
        </h2>
        <p className="line-clamp-4 text-sm leading-relaxed text-foreground/80">
          {result.content}
        </p>
      </Card>
    </Link>
  );
}
