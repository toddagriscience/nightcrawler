// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Lenis from '@studio-freight/lenis';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

/**
 * Global Window interface extension to include Lenis instance
 * Allows type-safe access to the globally stored Lenis smooth scroll instance
 */
declare global {
  interface Window {
    /** Optional Lenis smooth scroll instance stored globally for cross-component access */
    lenis?: Lenis;
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
  const router = useRouter();
  const pathname = usePathname();
  const [isLenisReady, setIsLenisReady] = useState(false);

  useEffect(() => {
    let lenis: Lenis | null = null;

    const initializeLenis = () => {
      try {
        lenis = new Lenis({
          duration: 1.1,
          easing: (t) =>
            t === 1
              ? 1
              : 1 - Math.pow(2, -10 * t) * Math.sin((t - 0.75) * Math.PI * 2),
          lerp: 0.07,
          wheelMultiplier: 0.7,
          smoothWheel: true,
        });

        // Store lenis instance globally after successful initialization
        window.lenis = lenis;
        setIsLenisReady(true);
      } catch (e) {
        console.error('Lenis Initialization Error', e);
        return;
      }

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    };

    const startLenis = () => {
      if (lenis) {
        const raf = (time: number) => {
          if (lenis) {
            lenis.raf(time);
          }
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    };

    const destroyLenis = () => {
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
      if (window.lenis) {
        delete window.lenis;
      }
    };
  }, [router]);

  // Handle scroll to top on navigation - only when Lenis is ready
  useEffect(() => {
    if (isLenisReady && window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, isLenisReady]);

  return <>{children}</>;
}
