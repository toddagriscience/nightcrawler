// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import useWindowWidth from '@/lib/hooks/useWindowWidth';

interface CompetenciesSectionProps {
  t: (key: string) => string;
}

/**
 * Competencies section with scroll-driven animation
 * Uses framer-motion useScroll to drive animations based on scroll position
 */
export default function CompetenciesSection({ t }: CompetenciesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const vennOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);

  const vennScale = useTransform(
    scrollYProgress,
    [0.25, 0.45],
    [isMobile ? 0.8 : 0.7, 1]
  );

  const progressBarHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  // Emulate sticky behavior
  const stickyY = useTransform(scrollYProgress, [0, 1], ['0%', '300%']);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      <motion.div
        style={{ y: stickyY }}
        className="relative top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Progress Bar Indicator */}
        <motion.div
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0, 0.1, 0.9, 1],
              [0, 1, 1, 0]
            ),
          }}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 h-32 md:h-48 w-1 bg-black/10 rounded-full overflow-hidden pointer-events-none"
        >
          <motion.div
            style={{ height: progressBarHeight }}
            className="w-full bg-black/40 rounded-full"
          />
        </motion.div>

        <div className="relative w-full max-w-[1400px] h-[400px] md:h-[600px] flex items-center justify-center">
          {/* Competencies Title */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute inset-0 flex items-center justify-center z-10 px-6"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl max-w-[300px] md:max-w-[450px] lg:max-w-[550px] leading-tight font-thin text-center">
              {t('competencies.title')}
            </h2>
          </motion.div>

          {/* Competencies Circles */}
          <motion.div
            style={{
              opacity: vennOpacity,
              scale: vennScale,
            }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {[0, 1, 2].map((index) => (
                <CompetencyCircle
                  key={index}
                  index={index}
                  progress={scrollYProgress}
                  t={t}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Individual competency circle component with animated positioning
 */
function CompetencyCircle({
  index,
  progress,
  t,
  isMobile,
}: {
  index: number;
  progress: MotionValue<number>;
  t: (key: string) => string;
  isMobile: boolean;
}) {
  const radius = isMobile ? 96 : 128;
  const triangleOffset = isMobile ? 150 : 200;
  const spreadDistance = isMobile ? 240 : 320;

  // Venn diagram positions (triangular formation)
  const vennPositions = [
    { top: '50%', x: -radius, y: -(radius + triangleOffset * 0.577) },
    {
      top: '50%',
      x: -(radius + triangleOffset * 0.5),
      y: -(radius - triangleOffset * 0.289),
    },
    {
      top: '50%',
      x: -(radius - triangleOffset * 0.5),
      y: -(radius - triangleOffset * 0.289),
    },
  ];

  // Spread positions (vertical on mobile, horizontal on desktop)
  const spreadPositions = isMobile
    ? [
        { top: '50%', x: -radius, y: -(radius + spreadDistance) }, // Top
        { top: '50%', x: -radius, y: -radius }, // Center
        { top: '50%', x: -radius, y: -(radius - spreadDistance) }, // Bottom
      ]
    : [
        { top: '50%', x: -(radius + spreadDistance), y: -radius },
        { top: '50%', x: -radius, y: -radius },
        { top: '50%', x: -(radius - spreadDistance), y: -radius },
      ];

  const start = vennPositions[index];
  const end = spreadPositions[index];

  // Animated transforms
  // Moving from phase 2 (Venn) to phase 3 (Spread)
  const x = useTransform(progress, [0.55, 0.9], [start.x, end.x]);
  const y = useTransform(progress, [0.55, 0.9], [start.y, end.y]);
  const top = useTransform(progress, [0.55, 0.9], [start.top, end.top]);

  const numberOpacity = useTransform(progress, [0.55, 0.75], [1, 0]);
  const textOpacity = useTransform(progress, [0.65, 0.9], [0, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        x,
        y,
      }}
      className="flex items-center justify-center text-center left-1/2"
    >
      <div className="flex size-48 md:size-64 flex-col items-center justify-center rounded-full border-0 bg-[#AB844F]/20 p-6 md:p-8 transition-[background-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-black/10">
        <motion.p
          style={{ opacity: numberOpacity }}
          className="absolute text-3xl md:text-4xl font-thin"
        >
          {index + 1}
        </motion.p>
        <motion.p
          style={{ opacity: textOpacity }}
          className="text-sm md:text-base lg:text-lg font-thin leading-relaxed"
        >
          {t(`competencies.items.${index}`)}
        </motion.p>
      </div>
    </motion.div>
  );
}
