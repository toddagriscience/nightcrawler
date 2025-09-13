import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsCard } from '@/components/common';
import { Button } from '@/components/ui';
import NewsCardProps from '../news-card/types/news-card';

interface Props {
  items: NewsCardProps[];
}

/*
 * A carousel for featured news.
 * @param {Props} items - A list of `NewsCardProps`
 */
export function FeaturedNewsCarousel({ items }: Props) {
  const [current, setCurrent] = useState(0);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [setCurrent, items]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full max-w-[640px] scale-95">
        <div className="absolute top-1/2 left-[-2rem] z-10 -translate-y-1/2">
          <Button
            onClick={handlePrev}
            variant="ghost"
            className="rounded-full bg-[#727272]/60 text-white shadow-md hover:bg-[#727272]/80"
          >
            ←
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={items[current].excerpt}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <NewsCard {...items[current]} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-1/2 right-[-2rem] z-10 -translate-y-1/2">
          <Button
            onClick={handleNext}
            variant="ghost"
            className="rounded-full bg-[#727272]/60 text-white shadow-md hover:bg-[#727272]/80"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
