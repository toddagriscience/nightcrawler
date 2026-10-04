// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import useMediaQuery from '@/lib/hooks/useMediaQuery';
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
import type { PartnerProps } from './types';

/** Layout shared by every logo group: a two-column grid on mobile, a centered wrapping row on desktop. */
const GROUP_CLASSNAME =
  'mx-auto grid w-full max-w-sm grid-cols-2 place-items-center gap-x-6 gap-y-8 sm:gap-10 md:flex md:max-w-[90vw] md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-12';

/** The partner logos shown in the first rotation group. Alt text is each organization's proper name, so it stays identical across locales. */
const GROUP_ONE_PARTNERS: PartnerProps[] = [
  { src: USDA, alt: 'USDA' },
  { src: FarmLink, alt: 'The Farmlink Project' },
  { src: WholeFoods, alt: 'Whole Foods Market' },
  { src: NMState, alt: 'New Mexico State University' },
  {
    src: BDA,
    alt: 'Biodynamic Demeter Alliance',
    className: 'w-32 sm:w-38 md:w-45',
  },
  {
    src: CCOF,
    alt: 'CCOF Foundation',
    className: 'w-14 sm:w-16 md:-ml-4 md:w-18',
  },
];

/** The partner logos shown in the second rotation group. */
const GROUP_TWO_PARTNERS: PartnerProps[] = [
  { src: OFA, alt: 'Organic Farmers Association' },
  { src: WhyRegenerative, alt: 'Why Regenerative' },
  { src: CenterForFoodSafety, alt: 'Center for Food Safety' },
  { src: CornellCals, alt: 'Cornell CALS' },
];

/** The partners section of the About page
 * @returns {JSX.Element} - The partners section */
export default function Partners() {
  const t = useTranslations('whoWeAre');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [index, setIndex] = useState(0);

  // Rotate only once the client has confirmed the visitor has not asked for
  // reduced motion. During SSR and the hydration render the query is still
  // `undefined`, so both stay on the static branch below and the client never
  // disagrees with the server HTML. The subscription also stops the rotation
  // live if the visitor turns reduced motion on mid-session.
  const rotate = reduceMotion === false;

  useEffect(() => {
    if (!rotate) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, [rotate]);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Two halves of one phrase, kept as separate spans because each occupies its
  // own cell in the logo grid. Translations must break at this boundary.
  const tagline = (
    <>
      <span className="font-bold">{t('partners.tagline.0')}</span>
      <span className="font-bold">{t('partners.tagline.1')}</span>
    </>
  );

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
        {rotate ? (
          // initial={false}: this branch mounts after the static layout has
          // already painted, so the first group must appear settled rather
          // than fade in from transparent. Later rotations still animate.
          <AnimatePresence mode="wait" initial={false}>
            {index === 0 ? (
              <motion.div
                key="group1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className={GROUP_CLASSNAME}
              >
                {GROUP_ONE_PARTNERS.map((partner) => (
                  <Partner key={partner.alt} {...partner} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="group2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className={GROUP_CLASSNAME}
              >
                {GROUP_TWO_PARTNERS.map((partner) => (
                  <Partner key={partner.alt} {...partner} />
                ))}
                {tagline}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          // Static-first: the server HTML and the hydration render show every
          // partner at once, so the full list reaches crawlers and screen
          // readers, and stays put for visitors who prefer reduced motion.
          <div className={GROUP_CLASSNAME}>
            {[...GROUP_ONE_PARTNERS, ...GROUP_TWO_PARTNERS].map((partner) => (
              <Partner key={partner.alt} {...partner} />
            ))}
            {tagline}
          </div>
        )}
      </div>
    </div>
  );
}
