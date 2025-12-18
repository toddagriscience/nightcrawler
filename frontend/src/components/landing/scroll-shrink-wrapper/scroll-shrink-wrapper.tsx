// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

/**
 * Scroll shrink wrapper component
 *
 * features:
 * - shrinks the width of the container as the user scrolls
 *
 * @param {React.ReactNode} children - The children to be wrapped
 * @returns {JSX.Element} - The scroll shrink wrapper component
 */
const ScrollShrinkWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const width = useTransform(scrollYProgress, [0, 1], ['100vw', '95vw']);

  return (
    <div ref={containerRef} className="w-full">
      <motion.div style={{ width }} className="mx-auto">
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollShrinkWrapper;
