// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';
import type FadeInProps from './types/fade-in';

/**
 * Inner component keyed by `usePathname()`; opacity remains solid to avoid transition flashes.
 *
 * @param props - {@link FadeInProps}
 * @returns Wrapper around children
 */
function FadeInInner({
  children,
  duration = 0.73,
  className = '',
}: FadeInProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration, type: 'tween' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Layout wrapper keyed by pathname inside `Suspense` (for `cacheComponents` compatibility).
 * Uses full opacity so route changes do not show a semi-transparent loading frame.
 *
 * @param {React.ReactNode} children - The content to animate
 * @param {number} duration - Kept for API compatibility with Framer Motion transition
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} - The fade-in shell component
 */
const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration,
  className = '',
}) => (
  <Suspense fallback={<div className={className}>{children}</div>}>
    <FadeInInner duration={duration} className={className}>
      {children}
    </FadeInInner>
  </Suspense>
);

export default FadeIn;
