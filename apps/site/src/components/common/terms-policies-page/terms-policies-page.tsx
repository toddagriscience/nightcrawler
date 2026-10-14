// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { TermsPoliciesPageProps } from './types';

/**
 * Shared page shell for the "Terms & Policies" routes grouped in the site footer
 * (`/terms`, `/privacy`, `/accessibility`). Owns the column width, page heading,
 * and hairline rule so the pages share one source of truth for their layout.
 *
 * Compose the body from `PolicySection`, `PolicyBody`, `PolicySubheading`, and
 * `PolicyList` rather than restating the prose classes at each call site.
 *
 * @param {TermsPoliciesPageProps} props - Page heading, body content, and optional extra classes
 * @returns {JSX.Element} - The page shell
 */
export default function TermsPoliciesPage({
  title,
  children,
  className,
}: TermsPoliciesPageProps) {
  return (
    <div className={cn('mx-auto max-w-3xl px-2 pt-8', className)}>
      <h1 className="mt-16 mb-8 text-4xl font-light">{title}</h1>
      <div className="mb-6 h-px bg-[#2A2727] opacity-20" />
      {children}
    </div>
  );
}
