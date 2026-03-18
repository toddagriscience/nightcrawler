// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { KnowledgeArticleSelect } from '@/lib/types/db';

export interface SearchClientProps {
  query: string;
  results: KnowledgeArticleSelect[];
  error: string | null;
}
