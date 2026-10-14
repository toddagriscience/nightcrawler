// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion } from 'framer-motion';
import type FadeInProps from './types/fade-in';

/**
 * Stable full-opacity layout wrapper. Children are rendered once, so streamed
 * HTML never contains a second copy in a Suspense fallback. Duration remains
 * compatible with existing callers; route scroll handling lives in SmoothScroll.
 */
export default function FadeIn({
  children,
  duration = 0.73,
  className = '',
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration, type: 'tween' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
