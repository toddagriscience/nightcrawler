// Copyright Todd LLC, All rights reserved.

'use client';

import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

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
    };
  }, [router]);

  return <>{children}</>;
}
