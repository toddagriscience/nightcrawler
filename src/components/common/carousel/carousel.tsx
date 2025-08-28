'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, ReactNode, useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { theme } from '@/lib/theme';

interface CarouselProps {
  children: ReactNode;
  isDark?: boolean;
  loop?: boolean;
  className?: string;
  showDots?: boolean;
}

const Carousel = ({
  children,
  loop = true,
  className = '',
  showDots = true,
  isDark = false,
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
      // Tablet: scroll 1 item at a time
      setSlidesToScroll(1);
    } else {
      // Desktop: scroll 2 items at a time
      setSlidesToScroll(2);
    }
  }, []);

  useEffect(() => {
    updateSlidesToScroll();

    const handleResize = () => {
      updateSlidesToScroll();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSlidesToScroll]);

  useEffect(() => {
    if (emblaApi) {
      // Set up scroll snaps and selection tracking
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());

      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

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
    <div className={`relative overflow-hidden ${className}`} ref={emblaRef}>
      <div className="embla__container flex w-full">{children}</div>

      <button
        onClick={scrollPrev}
        ref={prevBtnRef}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-black/30 hover:bg-black/50 hover:cursor-pointer duration-300 ease-in-out transition-all p-1"
        aria-label="Previous slide"
      >
        <ArrowLeft color="#FDFDFB" />
      </button>

      <button
        onClick={scrollNext}
        ref={nextBtnRef}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-black/30 hover:bg-black/50 hover:cursor-pointer duration-300 ease-in-out transition-all p-1"
        aria-label="Next slide"
      >
        <ArrowRight color="#FDFDFB" />
      </button>

      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center space-x-3 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`relative rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer ${
                index === selectedIndex
                  ? 'w-8 h-2 scale-110'
                  : 'w-2 h-2 hover:scale-125'
              }`}
              style={{
                backgroundColor:
                  index === selectedIndex
                    ? isDark
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary
                    : isDark
                      ? theme.colors.text.inverse + '40'
                      : theme.colors.text.primary + '40',
              }}
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
