// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import BDA from '@public/marketing/partners/bda.png';
import CCOF from '@public/marketing/partners/ccof.png';
import CenterForFoodSafety from '@public/marketing/partners/centerforfoodsafety.png';
import CornellCals from '@public/marketing/partners/cornellcals.png';
import FarmLink from '@public/marketing/partners/farmlink.png';
import NMState from '@public/marketing/partners/nmstate.png';
import OFA from '@public/marketing/partners/ofa.png';
import USDA from '@public/marketing/partners/usda.png';
import WholeFoods from '@public/marketing/partners/wholefoods.png';
import WhyRegenerative from '@public/marketing/partners/whyregenerative.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Partner from './partner';

/** The partners section of the About page
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
    <div className="mb-20 space-y-8 pt-12 md:pt-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <h2 className="text-3xl leading-tight font-normal md:text-4xl">
          {t('partners.title')}
        </h2>
        <p className="max-w-xl px-4 pt-4 text-base leading-relaxed font-normal">
          {t('partners.description')}
        </p>
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
              className="mx-auto grid w-full max-w-sm grid-cols-2 place-items-center gap-x-6 gap-y-8 sm:gap-10 md:flex md:max-w-[90vw] md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-12"
            >
              <Partner src={USDA} alt="USDA" />
              <Partner src={FarmLink} alt="The Farmlink Project" />
              <Partner src={WholeFoods} alt="Whole Foods Market" />
              <Partner src={NMState} alt="New Mexico State University" />
              <Partner
                src={BDA}
                alt="Biodynamic Demeter Alliance"
                className="w-32 sm:w-38 md:w-45"
              />
              <Partner
                src={CCOF}
                alt="CCOF Foundation"
                className="w-14 sm:w-16 md:-ml-4 md:w-18"
              />
            </motion.div>
          ) : (
            <motion.div
              key="group2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="mx-auto grid w-full max-w-sm grid-cols-2 place-items-center gap-x-6 gap-y-8 sm:gap-10 md:flex md:max-w-[90vw] md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-12"
            >
              <Partner src={OFA} alt="Organic Farming Association" />
              <Partner
                src={WhyRegenerative}
                alt="Why Regenerative Agriculture"
              />
              <Partner src={CenterForFoodSafety} alt="Center for Food Safety" />
              <Partner src={CornellCals} alt="Cornell CALS" />
              <span className="font-bold">And Other</span>
              <span className="font-bold">Notable Partners</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
