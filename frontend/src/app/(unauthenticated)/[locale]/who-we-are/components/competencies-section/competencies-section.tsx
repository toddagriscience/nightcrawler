// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

const SCROLL_THRESHOLD = 150;
const SWIPE_MIN_DISTANCE = 30;
const SWIPE_MAX_TIME = 600;
const SNAP_TIMEOUT_BUFFER = 100;
const SECTION_COUNT = 3;

interface CompetenciesSectionProps {
  t: (key: string) => string;
}

/**
 * Competencies section with scroll-locked animation
 * Features three snap points: title, venn diagram, and spread layout
 */
export default function CompetenciesSection({ t }: CompetenciesSectionProps) {
  // Competencies section state
  const competenciesRef = useRef<HTMLDivElement>(null);
  const competencyProgress = useMotionValue(0);
  const [isLocked, setIsLocked] = useState(false);
  const [currentSection, setCurrentSection] = useState(0); // 0 = title, 1 = venn, 2 = spread

  // Interaction tracking refs
  const scrollAccumulator = useRef(0);
  const animatingRef = useRef(false);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const hasManuallyUnlocked = useRef(false);

  // Competency animation transforms (aligned with 3 snap points: 0, 0.5, 1.0)
  const titleOpacity = useTransform(competencyProgress, [0, 0.3], [1, 0]);
  const vennOpacity = useTransform(competencyProgress, [0.2, 0.5], [0, 1]);
  const vennScale = useTransform(
    competencyProgress,
    [0.2, 0.5],
    [
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
        ? 0.8
        : 0.7,
      1,
    ]
  );
  const progressBarHeight = useTransform(
    competencyProgress,
    [0, 1],
    ['0%', '100%']
  );

  // Handle scroll and touch input when section is locked
  useEffect(() => {
    const navigateToSection = (direction: number) => {
      const newSection = currentSection + direction;

      // Unlock and exit if navigating beyond bounds
      if (newSection >= SECTION_COUNT || newSection < 0) {
        scrollAccumulator.current = 0;
        hasManuallyUnlocked.current = true;
        setIsLocked(false);
        window.lenis?.start();
        return;
      }

      // Animate to new section
      setCurrentSection(newSection);
      animatingRef.current = true;

      const targetProgress = newSection === 0 ? 0 : newSection === 1 ? 0.5 : 1;
      const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      animate(competencyProgress, targetProgress, {
        duration: prefersReducedMotion ? 0.01 : isMobileDevice ? 0.6 : 0.8,
        ease: 'easeOut',
        onComplete: () => {
          animatingRef.current = false;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked || animatingRef.current) return;

      // Allow immediate unlock at section boundaries
      if (currentSection === 0 && e.deltaY < 0) {
        scrollAccumulator.current = 0;
        hasManuallyUnlocked.current = true;
        setIsLocked(false);
        competencyProgress.set(0);
        window.lenis?.start();
        return;
      }

      if (currentSection === 2 && e.deltaY > 0) {
        scrollAccumulator.current = 0;
        hasManuallyUnlocked.current = true;
        setIsLocked(false);
        window.lenis?.start();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Accumulate scroll until threshold is reached
      scrollAccumulator.current += e.deltaY;

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        scrollAccumulator.current = 0;
        navigateToSection(direction);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isLocked || animatingRef.current) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked || animatingRef.current) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isLocked || animatingRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = Date.now() - touchStartTime.current;

      // Allow immediate unlock at section boundaries
      if (currentSection === 0 && deltaY < 0) {
        hasManuallyUnlocked.current = true;
        setIsLocked(false);
        competencyProgress.set(0);
        window.lenis?.start();
        return;
      }

      if (currentSection === 2 && deltaY > 0) {
        hasManuallyUnlocked.current = true;
        setIsLocked(false);
        window.lenis?.start();
        return;
      }

      // Process swipe gesture
      if (
        Math.abs(deltaY) >= SWIPE_MIN_DISTANCE &&
        deltaTime <= SWIPE_MAX_TIME
      ) {
        const direction = deltaY > 0 ? 1 : -1;
        navigateToSection(direction);
      }
    };

    if (isLocked) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLocked, competencyProgress, currentSection]);

  // Observe section entry and exit for locking/unlocking behavior
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !isLocked &&
            !hasManuallyUnlocked.current
          ) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            const comingFromBelow = rect.top < viewportHeight / 2;
            const isMobileDevice =
              window.matchMedia('(max-width: 768px)').matches;
            const snapDuration = isMobileDevice ? 0.4 : 0.6;

            // Snap section to center of viewport
            window.lenis?.scrollTo(entry.target as HTMLElement, {
              offset: -((viewportHeight - rect.height) / 2),
              duration: snapDuration,
              easing: (t: number) => 1 - Math.pow(1 - t, 3),
              lock: true,
            });

            // Set initial state based on scroll direction
            const initialSection = comingFromBelow ? 2 : 0;
            const initialProgress = comingFromBelow ? 1 : 0;
            setCurrentSection(initialSection);
            competencyProgress.set(initialProgress);

            // Lock after snap animation completes
            setTimeout(
              () => {
                window.lenis?.stop();
                setIsLocked(true);
              },
              snapDuration * 1000 + SNAP_TIMEOUT_BUFFER
            );
          }
        });
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );

    const resetObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const rect = entry.boundingClientRect;

            // Reset state when section leaves viewport
            if (rect.top > 0 || rect.bottom < 0) {
              setIsLocked(false);
              scrollAccumulator.current = 0;
              hasManuallyUnlocked.current = false;

              // Set appropriate section based on scroll direction
              if (rect.top > 0) {
                setCurrentSection(0);
                competencyProgress.set(0);
              } else {
                setCurrentSection(2);
                competencyProgress.set(1);
              }
            }
          }
        });
      },
      { threshold: 0 }
    );

    if (competenciesRef.current) {
      observer.observe(competenciesRef.current);
      resetObserver.observe(competenciesRef.current);
    }

    return () => {
      observer.disconnect();
      resetObserver.disconnect();
    };
  }, [isLocked, competencyProgress]);

  return (
    <div
      ref={competenciesRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden touch-pan-y"
      style={{ touchAction: isLocked ? 'none' : 'pan-y' }}
    >
      {/* Progress Bar Indicator */}
      <motion.div
        animate={{ opacity: isLocked ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 h-32 md:h-48 w-1 bg-black/10 rounded-full overflow-hidden"
      >
        <motion.div
          style={{ height: progressBarHeight }}
          className="w-full bg-black/40 rounded-full"
        />
      </motion.div>

      <div className="relative w-full max-w-[1400px] h-[400px] md:h-[600px] flex items-center justify-center">
        {/* Competencies Title */}
        <motion.div
          style={{ opacity: titleOpacity, willChange: 'opacity' }}
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
            willChange: 'opacity, transform',
          }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {[0, 1, 2].map((index) => (
              <CompetencyCircle
                key={index}
                index={index}
                progress={competencyProgress}
                t={t}
              />
            ))}
          </div>
        </motion.div>
      </div>
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
  /* eslint-disable react-hooks/rules-of-hooks */
  // Note: Hooks are safe here because index prop is fixed per component instance

  const isMobileView =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches;
  const radius = isMobileView ? 96 : 128;
  const triangleOffset = isMobileView ? 150 : 200;
  const spreadDistance = isMobileView ? 220 : 320;

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
  const spreadPositions = isMobileView
    ? [
        { top: '50%', x: -radius, y: -(radius + spreadDistance) },
        { top: '50%', x: -radius, y: -radius },
        { top: '50%', x: -radius, y: -(radius - spreadDistance) },
      ]
    : [
        { top: '50%', x: -(radius + spreadDistance), y: -radius },
        { top: '50%', x: -radius, y: -radius },
        { top: '50%', x: -(radius - spreadDistance), y: -radius },
      ];

  const start = vennPositions[index];
  const end = spreadPositions[index];

  // Animated transforms
  const x = useTransform(progress, [0.5, 1.0], [start.x, end.x]);
  const y = useTransform(progress, [0.5, 1.0], [start.y, end.y]);
  const top = useTransform(progress, [0.5, 1.0], [start.top, end.top]);
  const numberOpacity = useTransform(progress, [0.5, 0.7], [1, 0]);
  const textOpacity = useTransform(progress, [0.65, 0.9], [0, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        x,
        y,
        willChange: 'transform',
      }}
      className="flex items-center justify-center text-center left-1/2"
    >
      <div className="flex size-48 md:size-64 flex-col items-center justify-center rounded-full border-0 bg-black/5 p-6 md:p-8 transition-[background-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-black/10 will-change-[background-color]">
        <motion.p
          style={{ opacity: numberOpacity, willChange: 'opacity' }}
          className="absolute text-3xl md:text-4xl font-thin"
        >
          {index + 1}
        </motion.p>
        <motion.p
          style={{ opacity: textOpacity, willChange: 'opacity' }}
          className="text-sm md:text-base lg:text-lg font-thin leading-relaxed"
        >
          {t(`competencies.items.${index}`)}
        </motion.p>
      </div>
    </motion.div>
  );
}
