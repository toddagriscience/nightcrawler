// Copyright Todd Agriscience, Inc. All rights reserved.

'use client';

import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';
import { PageHeroProps } from './types/page-hero';

/**
 * PageHero component for displaying a hero section on pages
 * Two-column layout with large title on the left and subtitle on the right
 * @param title - The title of the page
 * @param subtitle - The subtitle of the page
 * @param showArrow - Whether to show the arrow
 * @param className - The class name of the page hero
 * @returns {JSX.Element} - The page hero component
 */
const PageHero = ({
  title,
  subtitle,
  showArrow = true,
  className,
}: PageHeroProps) => {
  return (
    <div
      data-testid="page-hero"
      className={cn(
        'justify-end mx-auto flex flex-col h-[85vh] sm:h-[90vh] lg:h-[97vh] pb-16 sm:pb-24 lg:pb-32 max-w-7xl px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className="grid grid-cols-1 px-4 md:px-0 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start lg:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight select-none pointer-events-none">
            {title}
          </h1>
        </div>
        {subtitle && (
          <div className="mt-4 lg:mt-0">
            <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-muted-foreground select-none pointer-events-none">
              {subtitle}
            </p>
          </div>
        )}
      </div>
      {showArrow && (
        <div className="flex justify-center mt-12 lg:mt-16">
          <ArrowDown className="text-foreground" />
        </div>
      )}
    </div>
  );
};

export default PageHero;
