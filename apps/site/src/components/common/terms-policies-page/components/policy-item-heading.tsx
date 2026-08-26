// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { PolicyItemHeadingProps } from '../types';

/**
 * Heading for repeated entries inside a section, such as the California data
 * categories and rights lists in the privacy policy. Carries the prose type
 * scale rather than a heading scale.
 *
 * The level is a prop because the visual size is fixed while the right level
 * depends on where the entries sit: the rights list is nested under an `h3` and
 * so takes the default `h4`, whereas the categories grid hangs straight off the
 * supplement's `h2` and would skip a level at `h4`.
 *
 * @param {PolicyItemHeadingProps} props - Heading content, level, and optional extra classes
 * @returns {JSX.Element} - The heading
 */
export default function PolicyItemHeading({
  children,
  className,
  level = 4,
}: PolicyItemHeadingProps) {
  const Heading = `h${level}` as const;

  return (
    <Heading className={cn('text-[13px] font-normal', className)}>
      {children}
    </Heading>
  );
}
