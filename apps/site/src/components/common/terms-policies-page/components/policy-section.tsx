// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { PolicySectionProps } from '../types';

/**
 * Titled section within a terms & policies page.
 *
 * @param {PolicySectionProps} props - Optional heading, section content, and extra classes
 * @returns {JSX.Element} - The section
 */
export default function PolicySection({
  title,
  children,
  className,
}: PolicySectionProps) {
  return (
    <section className={cn(className)}>
      {title !== undefined ? (
        <h2 className="mb-6 text-xl font-light">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
