// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { PartnerProps } from './types';

/** A single partner logo
 * @returns {JSX.Element} - The logo for a given partner, formatted to fit in the Partners component correctly. */
export default function Partner({ src, alt, className }: PartnerProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn('h-auto w-20 object-scale-down sm:w-22 md:w-24', className)}
    />
  );
}
