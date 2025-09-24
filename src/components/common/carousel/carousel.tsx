// Copyright Todd LLC, All rights reserved.

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import CarouselProps from './types/carousel';

/**
 * A responsive carousel component built with Embla Carousel.
 *
 * Features:
 * - Responsive behavior: scrolls 1 item on mobile/tablet, 2 items on desktop
 * - Optional infinite loop scrolling
 * - Navigation arrows with hover effects
 * - Pagination dots with theme integration
 * - Dark mode support
 * - Smooth animations and transitions
 * - Touch/drag support (disabled by default)
 * - Accessibility features with ARIA labels
 *
 * @param children - React elements to be displayed as carousel slides
 * @param loop - Enable infinite loop scrolling (default: true)
 * @param className - Additional CSS classes to apply to the carousel container
 * @param showDots - Display pagination dots below the carousel (default: true)
 * @returns A fully functional carousel component
 *
 * @example
 * ```tsx
 * <Carousel showDots={true} loop={true}>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </Carousel>
 * ```
 */
const Carousel = ({
  children,
  loop = true,
  className = '',
  showDots = true,
}: CarouselProps) => {
  const [slidesToScroll, setSlidesToScroll] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      watchDrag: false,
      slidesToScroll,
    },
    []
  );

  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const updateSlidesToScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;

    // Calculate slides to scroll based on screen size
    if (width < 768) {
      // Mobile/Tablet: scroll 1 item at a time
      setSlidesToScroll(1);
    } else {
      // Desktop: scroll 2 items at a time
      setSlidesToScroll(2);
    }
  }, []);

  const handleResize = useCallback(() => {
    updateSlidesToScroll();
  }, [updateSlidesToScroll]);

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    updateSlidesToScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSlidesToScroll, handleResize]);

  useEffect(() => {
    if (emblaApi) {
      // Set up scroll snaps and selection tracking
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());

      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi, onSelect]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex w-full">{children}</div>
        <button
          onClick={scrollPrev}
          ref={prevBtnRef}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 transform rounded-full bg-black/10 p-1 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
          aria-label="Previous slide"
          data-testid="left-button"
        >
          <ArrowLeft className="text-foreground" />
        </button>
        <button
          onClick={scrollNext}
          ref={nextBtnRef}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 transform rounded-full bg-black/10 p-1 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
          aria-label="Next slide"
          data-testid="right-button"
        >
          <ArrowRight className="text-foreground" />
        </button>
      </div>
      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-8 flex justify-center space-x-3 px-4 pb-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`relative rounded-full transition-all duration-300 ease-in-out hover:cursor-pointer ${
                index === selectedIndex
                  ? 'bg-foreground h-2 w-8'
                  : 'bg-foreground/40 h-2 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === selectedIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
