// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import useWindowWidth from '@/lib/hooks/useWindowWidth';

/**
 * Scroll shrink wrapper component
 *
 * features:
 * - shrinks the width of the container as the user scrolls
 *
 * @param {React.ReactNode} children - The children to be wrapped
 * @param {number} stopWidth - The width at witch this component should be disabled, in px. Defaults to 10,000px
 * @returns {JSX.Element} - The scroll shrink wrapper component
 */
const ScrollShrinkWrapper = ({
  children,
  stopWidth = 10000,
}: {
  children: React.ReactNode;
  stopWidth?: number;
}) => {
  const windowWidth = useWindowWidth();

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const width = useTransform(
    scrollYProgress,
    [0, 0.15, 1],
    ['76vw', '100vw', '100vw']
  );

  if ((windowWidth && windowWidth > stopWidth) || !windowWidth) {
    return <div ref={containerRef}>{children}</div>;
  }

  return (
    <div ref={containerRef} className="w-full">
      <motion.div style={{ width }} className="mx-auto">
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollShrinkWrapper;
