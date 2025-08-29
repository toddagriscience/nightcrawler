// Copyright Todd LLC, All rights reserved.

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Hero, ScrollShrinkWrapper, NewsHighlightCard } from '../';
import { useTheme } from '@/context/theme/ThemeContext';

/**
 * Landing page component
 * @returns {JSX.Element} - The landing page component
 */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const newsCarouselRef = useRef<HTMLDivElement>(null);
  const { setIsDark } = useTheme();

  // Scroll-based theme detection
  const detectTheme = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Get section positions
    const heroRect = heroRef.current?.getBoundingClientRect();
    const newsRect = newsCarouselRef.current?.getBoundingClientRect();

    if (!heroRect || !newsRect) return;

    // Calculate when to transition to dark mode
    // Start transitioning when the news carousel is 20% visible from bottom
    const newsCarouselTop = scrollY + newsRect.top;
    const transitionPoint = newsCarouselTop - windowHeight * 0.2;

    // Apply immediate transition for scroll-based switching
    const shouldBeDark = scrollY > transitionPoint;
    setIsDark(shouldBeDark);
  }, [setIsDark]);

  // Set up scroll listener for theme detection
  useEffect(() => {
    // Initial detection
    detectTheme();

    // Throttled scroll handler for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          detectTheme();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectTheme);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectTheme);
    };
  }, [detectTheme]);

  return (
    <div className="flex min-h-screen bg-background text-foreground mx-auto flex-col">
      <div ref={heroRef}>
        <Hero />
      </div>
      <div ref={newsCarouselRef}>
        <ScrollShrinkWrapper>
          <NewsHighlightCard />
        </ScrollShrinkWrapper>
      </div>
    </div>
  );
}
