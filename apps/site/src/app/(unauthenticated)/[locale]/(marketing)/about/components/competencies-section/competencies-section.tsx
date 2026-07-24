// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  motion,
  MotionValue,
  transform,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

import useWindowWidth from '@/lib/hooks/useWindowWidth';

interface CompetenciesSectionProps {
  t: (key: string) => string;
}

/**
 * Competencies section with scroll-driven animation
 * Uses framer-motion useScroll to drive animations based on scroll position.
 * On lg and smaller, uses a simplified whileInView animation to avoid scroll jitter.
 */
export default function CompetenciesSection({ t }: CompetenciesSectionProps) {
  const windowWidth = useWindowWidth();

  // Until the real width is known (undefined on the server and first client
  // render), don't commit to a layout: rendering mobile first and swapping to
  // desktop after mount destabilizes the scroll-driven animation.
  if (windowWidth === undefined) {
    return null;
  }

  if (windowWidth < 1024) {
    return <CompetenciesSectionMobile t={t} />;
  }

  return <CompetenciesSectionDesktop t={t} />;
}

/**
 * Simplified layout with whileInView animations.
 */
function CompetenciesSectionMobile({ t }: { t: (key: string) => string }) {
  return (
    <section className="relative w-full py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-12"
      >
        <h2 className="text-2xl max-w-[300px] leading-tight font-thin text-center">
          {t('competencies.title')}
        </h2>
        <div className="flex flex-col items-center gap-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              className="flex size-48 flex-col items-center justify-center rounded-full border-0 bg-[#AB844F]/20 p-6 text-center transition-[background-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-black/10"
            >
              <p className="text-3xl font-thin">{index + 1}</p>
              <p className="text-sm font-thin leading-relaxed">
                {t(`competencies.items.${index}`)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Full scroll-driven animation with sticky emulation
 */
function CompetenciesSectionDesktop({ t }: { t: (key: string) => string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Title fades IN, holds for a long stretch (so it can't be missed), then
  // fades out while lifting slightly — all finished before the circles appear.
  //   scroll:  [in-start, in-done, out-start, out-done]
  // Title fades in quickly, then HOLDS for a long stretch (6% → 36% of the
  // scroll — nearly a full screen) so there is plenty of time to read it, then
  // fades out and lifts.
  // NOTE on the `transform(...)` wrappers below: when useTransform gets plain
  // keyframe arrays on an opacity-only element, framer-motion hands the
  // animation to the browser's ScrollTimeline API, which computes WRONG values
  // for this section (numbers faded back in; text never reached full opacity).
  // Passing a function forces the reliable JS path. transform(input, output)
  // builds that function from the same ranges — timing syntax is unchanged.
  const titleOpacity = useTransform(
    scrollYProgress,
    transform([0, 0.06, 0.3, 0.36], [0, 1, 1, 0])
  );
  const titleY = useTransform(
    scrollYProgress,
    transform([0.24, 0.34], [0, -30])
  );

  // Once the title is gone (after 36%) the circles fade in and gently scale up.
  const vennOpacity = useTransform(
    scrollYProgress,
    transform([0.38, 0.61], [0, 1])
  );

  const vennScale = useTransform(
    scrollYProgress,
    transform([0.38, 0.61], [0.3, 1])
  );

  const progressBarHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  // Emulate sticky behavior. The section is 4 screens tall (h-[400vh]); the
  // pinned content must translate (4 - 1) = 3 screens = 300% to stay centered
  // the whole time. (Taller than this — e.g. 500vh — pushes the finish too far
  // down the scroll to reach comfortably, so 4 screens is the sweet spot.)
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
              transform([0, 0.1, 0.9, 1], [0, 1, 1, 0])
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
            style={{ opacity: titleOpacity, y: titleY }}
            className="absolute inset-0 flex items-center justify-center z-10 px-6 pointer-events-none"
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
}: {
  index: number;
  progress: MotionValue<number>;
  t: (key: string) => string;
}) {
  const radius = 128; // half the circle's width — used to center each circle

  // Layout knobs. To CENTER a circle we shift it left/up by `radius`; every
  // position below is measured relative to that centered spot.
  const rowGap = 320; // horizontal space between circle centers in the final row
  const triSpread = 110; // how far the two lower circles sit left/right of center
  const triRise = 115; // how far the top circle sits ABOVE the row line
  const triDrop = 55; // how far the two lower circles sit BELOW the row line

  // Phase 1 — triangle (a Venn-style cluster). Circle 2 (index 1) is on top;
  // circles 1 and 3 sit below-left and below-right.
  const trianglePositions = [
    { x: -radius - triSpread, y: -radius + triDrop }, // circle 1 → bottom-left
    { x: -radius, y: -radius - triRise }, // circle 2 → top-middle
    { x: -radius + triSpread, y: -radius + triDrop }, // circle 3 → bottom-right
  ];

  // Phase 2 — an even, centered row. The top circle drops straight down into the
  // middle; the lower two slide out to the left and right.
  const rowPositions = [
    { x: -radius - rowGap, y: -radius }, // circle 1 → left
    { x: -radius, y: -radius }, // circle 2 → center (dropped down)
    { x: -radius + rowGap, y: -radius }, // circle 3 → right
  ];

  const start = trianglePositions[index];
  const end = rowPositions[index];

  // The circles reposition across 62% → 80% of the scroll.
  const x = useTransform(progress, [0.62, 0.8], [start.x, end.x]);
  const y = useTransform(progress, [0.62, 0.8], [start.y, end.y]);

  // Fade sequencing rule: the text's window must START after the number's
  // window ENDS — if the ranges overlap, both render semi-transparent at once.
  //   number: fully gone by 71% (the midpoint of the 62%→80% move)
  //   text:   starts at 73%, peaks at 84% — just as the circles settle —
  //           then holds at full opacity for the short remainder of the scroll.
  const numberOpacity = useTransform(progress, transform([0.62, 0.71], [1, 0]));
  const textOpacity = useTransform(progress, transform([0.73, 0.84], [0, 1]));

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        x,
        y,
      }}
      className="flex items-center justify-center text-center left-1/2"
    >
      <div className="relative flex size-48 md:size-64 flex-col items-center justify-center rounded-full border-0 bg-[#AB844F]/20 p-6 md:p-8 transition-[background-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-black/10">
        {/* Number: absolutely centered ON this circle (parent is `relative`). */}
        <motion.p
          style={{ opacity: numberOpacity }}
          className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-light text-[#4a3520]"
        >
          {index + 1}
        </motion.p>
        <motion.p
          style={{ opacity: textOpacity }}
          className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#4a3520]"
        >
          {t(`competencies.items.${index}`)}
        </motion.p>
      </div>
    </motion.div>
  );
}
