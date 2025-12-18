// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/theme/ThemeContext';
import { useCallback, useEffect, useRef } from 'react';
import { Hero, Quote, ScrollShrinkWrapper } from '../';
import NewsHighlights from '../news-highlights/news-highlights';

/**
 * Landing page component
 * @returns {JSX.Element} - The landing page component
 */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const newsCarouselRef = useRef<HTMLDivElement>(null);
  const { setIsDark, isDark: contextIsDark } = useTheme();

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

    // Apply transition for scroll-based switching (handled in global.css)
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
    <div className="mb-32">
      <ScrollShrinkWrapper>
        <div ref={heroRef}>
          <Hero />
        </div>
        <motion.div
          className="flex h-fit  mx-auto flex-col justify-center rounded-2xl bg-[#CCC5B5]"
          animate={{
            backgroundColor: contextIsDark ? '#2A2727' : '#CCC5B5',
            color: contextIsDark ? '#FDFDFB' : '#2A2727',
          }}
          ref={newsCarouselRef}
        >
          <NewsHighlights />
          <Quote isDark={contextIsDark} />
        </motion.div>
      </ScrollShrinkWrapper>
    </div>
  );
}
