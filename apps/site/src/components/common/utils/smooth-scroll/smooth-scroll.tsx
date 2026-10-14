// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Lenis from 'lenis';
import { logger } from '@/lib/logger';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Global Window interface extension to include Lenis instance
 * Allows type-safe access to the globally stored Lenis smooth scroll instance
 */
declare global {
  interface Window {
    /**
     * Optional Lenis smooth scroll instance stored globally for cross-component
     * access.
     *
     * Deliberately not the `lenis` key: since 1.3 Lenis claims that one itself
     * in its constructor.
     */
    __lenis?: Lenis;
  }
}

/**
 * SmoothScroll component that uses Lenis for smooth scrolling
 * @param {React.ReactNode} children - The content to animate
 * @returns {JSX.Element} - The animated smooth scroll component
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLenisReady, setIsLenisReady] = useState(false);
  /** When true, the latest navigation came from the history stack (back/forward); skip scroll-to-top. */
  const skipScrollFromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      skipScrollFromHistory.current = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let frameId: number | undefined;

    const initializeLenis = () => {
      try {
        lenis = new Lenis({
          // `duration`/`easing` are deliberately omitted to keep the same feel
          // of the site with the new lenis package
          lerp: 0.07,
          wheelMultiplier: 0.7,
          smoothWheel: true,
          // Under `prefers-reduced-motion: reduce` Lenis forces `lerp` to 1 so
          // scrolling tracks the input device 1:1, "disabling" smooth scroll.
          // This is the default, but set explicitly here for clarity
          respectReducedMotion: true,
        });

        // Store lenis instance globally after successful initialization
        window.__lenis = lenis;
        setIsLenisReady(true);
      } catch (e) {
        logger.error('Lenis initialization failed', e);
        return;
      }

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    };

    const startLenis = () => {
      if (lenis) {
        // Keep the latest frame id so cleanup can cancel the loop. Without
        // this the raf chain re-schedules itself forever and every remount
        // leaves another loop running for the life of the page.
        const raf = (time: number) => {
          if (lenis) {
            lenis.raf(time);
          }
          frameId = requestAnimationFrame(raf);
        };
        frameId = requestAnimationFrame(raf);
      }
    };

    const destroyLenis = () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
        frameId = undefined;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    };

    initializeLenis();
    startLenis();

    return () => {
      destroyLenis();
      setIsLenisReady(false);
      if (window.__lenis) {
        delete window.__lenis;
      }
    };
  }, []);

  // Handle scroll to top on navigation - only when Lenis is ready
  useEffect(() => {
    if (!isLenisReady || !window.__lenis) return;
    if (skipScrollFromHistory.current) {
      skipScrollFromHistory.current = false;
      return;
    }
    window.__lenis.scrollTo(0, { immediate: true });
  }, [pathname, isLenisReady]);

  return <>{children}</>;
}
