// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';
import type FadeInProps from './types/fade-in';

/**
 * FadeIn component that fades the entire page content on navigation
 * @param {React.ReactNode} children - The content to animate
 * @param {number} duration - Animation duration in seconds (default: 1.0)
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} - The animated fade-in component
 */
const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 1.0,
  className = '',
}) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
