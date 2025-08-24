'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const ScrollShrinkWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const width = useTransform(scrollYProgress, [0, 1], ['100vw', '98vw']);

  return (
    <div ref={containerRef} className="w-full">
      <motion.div style={{ width }} className="mx-auto">
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollShrinkWrapper;
