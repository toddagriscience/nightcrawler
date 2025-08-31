// Copyright Todd LLC, All rights reserved.

/**
 * Props for the PageHero component
 */
export interface PageHeroProps {
  /** The main title to display */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Whether to show the arrow indicator */
  showArrow?: boolean;
  /** Additional CSS classes */
  className?: string;
}
