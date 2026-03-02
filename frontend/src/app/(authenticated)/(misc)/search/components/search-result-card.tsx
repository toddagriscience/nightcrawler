// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Card } from '@/components/ui/card';
import type { KnowledgeArticleSelect } from '@/lib/types/db';

interface SearchResultCardProps {
  result: KnowledgeArticleSelect;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-foreground/10 text-foreground/70">
          {result.category}
        </span>
        {result.source && (
          <span className="text-xs text-foreground/50">{result.source}</span>
        )}
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        {result.title}
      </h2>
      <p className="text-foreground/80 text-sm leading-relaxed">
        {result.content}
      </p>
    </Card>
  );
}
