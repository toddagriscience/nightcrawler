// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import USDA from '@public/marketing/partners/usda.png';
import BDA from '@public/marketing/partners/bda.png';
import CCOF from '@public/marketing/partners/ccof.png';
import CenterForFoodSafety from '@public/marketing/partners/centerforfoodsafety.png';
import FarmLink from '@public/marketing/partners/farmlink.png';
import NMState from '@public/marketing/partners/nmstate.png';
import OFA from '@public/marketing/partners/ofa.png';
import WholeFoods from '@public/marketing/partners/wholefoods.png';
import WhyRegenerative from '@public/marketing/partners/whyregenerative.png';
import CornellCals from '@public/marketing/partners/cornellcals.png';
import Partner from './partner';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

/** The partners section of the who-we-are page
 * @returns {JSX.Element} - The partners section */
export default function Partners() {
  const t = useTranslations('whoWeAre');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="space-y-4 mb-20">
      <div className="flex sm:flex-row flex-col gap-8 sm:gap-16 max-w-[80vw] mx-auto">
        <h2 className="text-nowrap text-3xl md:text-4xl lg:text-5xl max-w-[200px] md:max-w-[250px] lg:max-w-[350px] leading-tight font-light md:basis-5/8">
          {t('partners.title')}
        </h2>
        <p className="font-light">{t('partners.description')}</p>
      </div>
      <div className="relative overflow-hidden min-h-50 gap-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {index === 0 ? (
            <motion.div
              key="group1"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-row flex-wrap gap-4 max-w-[90vw] mx-auto justify-center items-center"
            >
              <Partner src={USDA} />
              <Partner src={FarmLink} />
              <Partner src={WholeFoods} />
              <Partner src={BDA} />
              <Partner src={CCOF} />
              <Partner src={NMState} />
            </motion.div>
          ) : (
            <motion.div
              key="group2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-row flex-wrap gap-4 max-w-[90vw] mx-auto justify-center items-center"
            >
              <Partner src={OFA} />
              <Partner src={WhyRegenerative} />
              <Partner src={CenterForFoodSafety} />
              <Partner src={CornellCals} />
              <span className="font-bold">And Other</span>
              <span className="font-bold">Notable Partners</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
