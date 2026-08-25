// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { PolicyBlockProps } from '../types';

/**
 * Body paragraph for terms & policies pages. Owns the shared prose type scale so
 * the three pages cannot drift apart.
 *
 * @param {PolicyBlockProps} props - Paragraph content and optional extra classes
 * @returns {JSX.Element} - The paragraph
 */
export default function PolicyBody({ children, className }: PolicyBlockProps) {
  return (
    <p className={cn('text-[13px] leading-relaxed font-normal', className)}>
      {children}
    </p>
  );
}
