// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { PolicyBlockProps } from '../types';

/**
 * Third-level heading within a policy section, used for sub-topics such as the
 * regional supplements in the privacy policy.
 *
 * @param {PolicyBlockProps} props - Heading content and optional extra classes
 * @returns {JSX.Element} - The heading
 */
export default function PolicySubheading({
  children,
  className,
}: PolicyBlockProps) {
  return (
    <h3 className={cn('mb-3 text-lg font-light', className)}>{children}</h3>
  );
}
