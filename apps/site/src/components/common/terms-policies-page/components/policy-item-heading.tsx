// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { PolicyBlockProps } from '../types';

/**
 * Fourth-level heading for repeated entries inside a section, such as the
 * California data categories and rights lists in the privacy policy. Carries the
 * prose type scale rather than a heading scale, so callers supply the weight.
 *
 * @param {PolicyBlockProps} props - Heading content and optional extra classes
 * @returns {JSX.Element} - The heading
 */
export default function PolicyItemHeading({
  children,
  className,
}: PolicyBlockProps) {
  return <h4 className={cn('text-sm', className)}>{children}</h4>;
}
