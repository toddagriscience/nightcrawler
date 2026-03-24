// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';
import type FadeInProps from './types/fade-in';

/**
 * Inner component that accesses `usePathname()` (uncached request data)
 * and applies a fade-in animation keyed to the current route.
 *
 * @param props - {@link FadeInProps}
 * @returns Animated wrapper around children
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
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, type: 'tween' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeIn component that fades the entire page content on navigation.
 * Wraps the pathname-dependent animation in a Suspense boundary so
 * it does not block prerendering when `cacheComponents` is enabled.
 * The fallback renders children immediately without animation.
 *
 * @param {React.ReactNode} children - The content to animate
 * @param {number} duration - Animation duration in seconds (default: 0.73)
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} - The animated fade-in component
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
