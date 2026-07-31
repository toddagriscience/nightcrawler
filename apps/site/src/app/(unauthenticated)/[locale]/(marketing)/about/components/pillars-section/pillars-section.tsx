// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  motion,
  MotionProps,
  MotionValue,
  transform,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

import useMediaQuery from '@/lib/hooks/useMediaQuery';

interface PillarsSectionProps {
  t: (key: string) => string;
}

const PILLAR_INDICES = [0, 1, 2, 3, 4];

// Ring geometry, in SVG viewBox units. The ring is five arc segments (one per
// pillar), each ending in a chevron tip, so the segments read as five arrows
// chasing each other clockwise around one circle.
const RING_VIEWBOX = 400;
const RING_CENTER = RING_VIEWBOX / 2;
const RING_RADIUS = 170;
const SEGMENT_DEGREES = 360 / PILLAR_INDICES.length;
const SEGMENT_GAP_DEGREES = 18;

// Scroll timing for the reveal phase: column i fades in across
// [start + i * stagger, start + i * stagger + duration] of scroll progress,
// and ring arrow i brightens over the SAME window — that pairing is the whole
// point, so both components must read these constants rather than local ones.
const REVEAL_START = 0.68;
const REVEAL_STAGGER = 0.05;
const REVEAL_DURATION = 0.08;
const ARROW_DIM_OPACITY = 0.35;

// Math.sin/Math.cos are only required to be within an implementation-defined
// tolerance, so Node and the browser can disagree in the final digits. That
// makes the generated path strings differ between the server and client render
// and trips React's hydration attribute check. Rounding to a fixed precision
// collapses the discrepancy; at a 400-unit viewBox, 3 decimals is far finer
// than a device pixel.
const COORD_PRECISION = 3;

function roundCoord(value: number) {
  return Number(value.toFixed(COORD_PRECISION));
}

function ringPoint(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: roundCoord(RING_CENTER + RING_RADIUS * Math.sin(rad)),
    y: roundCoord(RING_CENTER - RING_RADIUS * Math.cos(rad)),
  };
}

function arrowGeometry(index: number) {
  const startAngle = index * SEGMENT_DEGREES + SEGMENT_GAP_DEGREES / 2;
  const endAngle = (index + 1) * SEGMENT_DEGREES - SEGMENT_GAP_DEGREES / 2;
  const from = ringPoint(startAngle);
  const to = ringPoint(endAngle);
  return {
    arcPath: `M ${from.x} ${from.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${to.x} ${to.y}`,
    // The circle's tangent at angle θ points at θ degrees in SVG space, so
    // rotating the +x-facing chevron by endAngle aims it clockwise along the
    // ring — each arrow points at the tail of the next one.
    tipTransform: `translate(${to.x} ${to.y}) rotate(${roundCoord(endAngle)})`,
  };
}

function ArrowGlyph({ index }: { index: number }) {
  const { arcPath, tipTransform } = arrowGeometry(index);
  return (
    <svg
      viewBox={`0 0 ${RING_VIEWBOX} ${RING_VIEWBOX}`}
      className="size-full"
      aria-hidden="true"
    >
      <path d={arcPath} fill="none" stroke="#AB844F" strokeWidth={1.5} />
      <path
        d="M -9 -6 L 0 0 L -9 6"
        fill="none"
        stroke="#AB844F"
        strokeWidth={2}
        strokeLinecap="round"
        transform={tipTransform}
      />
    </svg>
  );
}

function PillarRing() {
  return (
    <svg
      viewBox={`0 0 ${RING_VIEWBOX} ${RING_VIEWBOX}`}
      className="size-full"
      aria-hidden="true"
    >
      {PILLAR_INDICES.map((index) => {
        const { arcPath, tipTransform } = arrowGeometry(index);
        return (
          <g key={index}>
            <path d={arcPath} fill="none" stroke="#AB844F" strokeWidth={1.5} />
            <path
              d="M -9 -6 L 0 0 L -9 6"
              fill="none"
              stroke="#AB844F"
              strokeWidth={2}
              strokeLinecap="round"
              transform={tipTransform}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Builds the whileInView entrance props for the static layout, or nothing at
 * all when the user prefers reduced motion (content just renders in place).
 */
function fadeUpProps(reduceMotion: boolean, delay = 0): MotionProps {
  if (reduceMotion) {
    return {};
  }
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  };
}

/**
 * Pillars section with scroll-driven animation, placed between the
 * competencies and partners sections. A ring of five arrows spins around the
 * title as the user scrolls; each of the five pillar descriptions lights up
 * its matching arrow as it is revealed.
 *
 * Static-first: SSR and the hydration render emit the simple stacked layout
 * (so the copy is always present in the server HTML for crawlers and screen
 * readers); the scroll-driven desktop variant is a client-side enhancement
 * applied once matchMedia resolves to >= lg. Users who prefer reduced motion
 * keep the static layout at every width, with the infinite ring spin and
 * entrance animations disabled.
 */
export default function PillarsSection({ t }: PillarsSectionProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduceMotion = useReducedMotion() ?? false;

  if (isDesktop && !reduceMotion) {
    return <PillarsSectionDesktop t={t} />;
  }

  return <PillarsSectionMobile t={t} reduceMotion={reduceMotion} />;
}

/**
 * Simplified layout with whileInView animations (none when reduced motion,
 * and the decorative ring holds still instead of spinning).
 */
function PillarsSectionMobile({
  t,
  reduceMotion = false,
}: {
  t: (key: string) => string;
  reduceMotion?: boolean;
}) {
  const spinProps: MotionProps = reduceMotion
    ? {}
    : {
        animate: { rotate: 360 },
        transition: { repeat: Infinity, duration: 40, ease: 'linear' },
      };

  return (
    <section className="relative w-full py-24 px-6">
      <motion.div
        {...fadeUpProps(reduceMotion)}
        className="flex flex-col items-center gap-10"
      >
        <div className="relative flex size-72 items-center justify-center">
          <motion.div {...spinProps} className="absolute inset-0">
            <PillarRing />
          </motion.div>
          <h2 className="text-3xl font-thin text-center">
            {t('pillars.title')}
          </h2>
        </div>
        <p className="text-sm max-w-[320px] font-thin leading-relaxed text-center">
          {t('pillars.subtitle')}
        </p>
        <div className="flex flex-col items-center gap-8 w-full max-w-[400px]">
          {PILLAR_INDICES.map((index) => (
            <motion.div
              key={index}
              {...fadeUpProps(reduceMotion, index * 0.1)}
              className="flex flex-col items-center gap-2 text-center"
            >
              <h3 className="text-base font-normal text-[#4a3520]">
                {t(`pillars.items.${index}.heading`)}
              </h3>
              <p className="text-sm font-thin leading-relaxed">
                {t(`pillars.items.${index}.description`)}
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
function PillarsSectionDesktop({ t }: { t: (key: string) => string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // NOTE on the `transform(...)` wrappers below: when useTransform gets plain
  // keyframe arrays on an opacity-only element, framer-motion hands the
  // animation to the browser's ScrollTimeline API, which computes WRONG values
  // for this section. Passing a function forces the reliable JS path.
  // transform(input, output) builds that function from the same ranges.

  // Title fades in immediately and stays for the whole section.
  const titleOpacity = useTransform(
    scrollYProgress,
    transform([0, 0.04], [0, 1])
  );

  // Subtitle appears with the title, then fades out before the ring arrives.
  const subtitleOpacity = useTransform(
    scrollYProgress,
    transform([0, 0.04, 0.1, 0.18], [0, 1, 1, 0])
  );

  // The ring of arrows fades in around the title once the subtitle is gone,
  // and keeps slowly spinning for the rest of the scroll — including while
  // the pillar columns below light its arrows up one by one.
  const ringOpacity = useTransform(
    scrollYProgress,
    transform([0.18, 0.3], [0, 1])
  );
  const ringRotate = useTransform(
    scrollYProgress,
    transform([0.2, 0.9], [0, 300])
  );

  // Title + ring cluster shrinks and lifts to make room for the columns.
  // Wrapped in transform(...) for the same reason as the opacities above:
  // plain keyframe arrays can be handed to the browser's ScrollTimeline, which
  // mis-computes them here and makes the shrink jump rather than glide.
  const clusterScale = useTransform(
    scrollYProgress,
    transform([0.48, 0.66], [1, 0.7])
  );
  const clusterY = useTransform(
    scrollYProgress,
    transform([0.48, 0.66], [0, -120])
  );

  const progressBarHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  const progressBarOpacity = useTransform(
    scrollYProgress,
    transform([0, 0.08, 0.92, 1], [0, 1, 1, 0])
  );

  // Emulate sticky behavior. The section is 5 screens tall (h-[500vh]); the
  // pinned content must translate (5 - 1) = 4 screens = 400% to stay centered
  // the whole time.
  const stickyY = useTransform(scrollYProgress, [0, 1], ['0%', '400%']);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      {/* Progress Bar Indicator. Deliberately a sibling of the translated
          pane below: a transformed element becomes the containing block for
          its fixed-position descendants, so nesting this inside would make
          `fixed` resolve against the moving pane instead of the viewport. */}
      <motion.div
        style={{ opacity: progressBarOpacity }}
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 h-32 md:h-48 w-1 bg-black/10 rounded-full overflow-hidden pointer-events-none z-10"
      >
        <motion.div
          style={{ height: progressBarHeight }}
          className="w-full bg-black/40 rounded-full"
        />
      </motion.div>

      <motion.div
        style={{ y: stickyY }}
        className="relative top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div className="relative w-full max-w-[1400px] h-[600px] xl:h-[700px]">
          {/* Title + Ring cluster. `willChange: transform` promotes this to its
              own compositor layer so the glyphs are rasterized once and scaled
              on the GPU. Without it the browser re-rasterizes thin text at a
              new fractional scale every frame, which reads as shimmer. */}
          <motion.div
            style={{
              scale: clusterScale,
              y: clusterY,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
            className="absolute inset-0"
          >
            <motion.div
              style={{ opacity: titleOpacity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h2 className="text-5xl xl:text-6xl font-thin text-center">
                {t('pillars.title')}
              </h2>
            </motion.div>

            <motion.div
              style={{ opacity: subtitleOpacity }}
              className="absolute inset-x-0 top-[58%] flex justify-center px-6"
            >
              <p className="text-sm xl:text-base max-w-[360px] font-thin leading-relaxed text-center">
                {t('pillars.subtitle')}
              </p>
            </motion.div>

            {/* The ring is a square box centered via inset-0 + m-auto (NOT a
                translate — framer-motion's rotate would overwrite a transform-
                based centering), sized well past the title so they never
                overlap. */}
            <motion.div
              style={{ opacity: ringOpacity, rotate: ringRotate }}
              className="absolute inset-0 m-auto size-[26rem] xl:size-[30rem]"
            >
              {PILLAR_INDICES.map((index) => (
                <PillarArrow
                  key={index}
                  index={index}
                  progress={scrollYProgress}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Pillar Columns */}
          <div className="absolute bottom-0 inset-x-0 grid grid-cols-5 gap-8 px-10 xl:px-16">
            {PILLAR_INDICES.map((index) => (
              <PillarColumn
                key={index}
                index={index}
                progress={scrollYProgress}
                t={t}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * One arrow segment of the ring. Sits dim until its matching pillar column is
 * revealed, then brightens over the same scroll window.
 */
function PillarArrow({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const start = REVEAL_START + index * REVEAL_STAGGER;
  const opacity = useTransform(
    progress,
    transform([start, start + REVEAL_DURATION], [ARROW_DIM_OPACITY, 1])
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <ArrowGlyph index={index} />
    </motion.div>
  );
}

/**
 * Individual pillar column with scroll-driven fade-in, staggered by index and
 * synced to its ring arrow's brighten window.
 */
function PillarColumn({
  index,
  progress,
  t,
}: {
  index: number;
  progress: MotionValue<number>;
  t: (key: string) => string;
}) {
  const start = REVEAL_START + index * REVEAL_STAGGER;
  const opacity = useTransform(
    progress,
    transform([start, start + REVEAL_DURATION], [0, 1])
  );
  const y = useTransform(progress, [start, start + REVEAL_DURATION], [24, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="flex flex-col gap-2 text-left"
    >
      <h3 className="text-base font-normal text-[#4a3520]">
        {t(`pillars.items.${index}.heading`)}
      </h3>
      <p className="text-sm font-thin leading-relaxed">
        {t(`pillars.items.${index}.description`)}
      </p>
    </motion.div>
  );
}
