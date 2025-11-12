// Copyright Todd Agriscience, Inc. All rights reserved.

import { ReactNode } from 'react';

/**
 * Props for the Carousel component
 * @param {ReactNode} children - The children of the carousel
 * @param {boolean} isDark - Whether the carousel is dark
 * @param {boolean} loop - Whether the carousel should loop
 * @param {string} className - The class name of the carousel
 * @param {boolean} showDots - Whether the carousel should show dots
 */
export default interface CarouselProps {
  children: ReactNode;
  isDark?: boolean;
  loop?: boolean;
  className?: string;
  showDots?: boolean;
}
