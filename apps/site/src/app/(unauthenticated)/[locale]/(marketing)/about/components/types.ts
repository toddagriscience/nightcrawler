// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ImageProps } from 'next/image';

/** Properties used to render a partner logo. */
export interface PartnerProps {
  /** The statically imported partner logo. */
  src: ImageProps['src'];
  /** Accessible name of the partner represented by the logo. */
  alt: string;
  /** Optional Tailwind classes for logo-specific sizing. */
  className?: string;
}
