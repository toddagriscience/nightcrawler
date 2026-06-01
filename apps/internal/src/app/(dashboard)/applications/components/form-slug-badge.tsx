// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Badge } from '@/components/ui/badge';

/** Props for {@link FormSlugBadge}. */
export interface FormSlugBadgeProps {
  /** Sanity form slug (e.g. `iris-access` from `/forms/iris-access`) */
  slug: string;
}

/**
 * Tag for the CMS form a platform access submission came from.
 *
 * @param props - Form slug label
 */
export function FormSlugBadge({ slug }: FormSlugBadgeProps) {
  return (
    <Badge variant="secondary" className="font-mono font-normal">
      {slug}
    </Badge>
  );
}
