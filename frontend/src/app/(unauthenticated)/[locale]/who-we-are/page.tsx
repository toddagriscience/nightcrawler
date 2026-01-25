// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { Link } from '@/i18n/config';
import HeaderImg from '@/components/common/header-img/header-img';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Who We Are page component
 * @returns {JSX.Element} - The who we are page
 */
export default function WhoWeArePage() {
  const t = useTranslations('whoWeAre');
  const imageSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageSectionRef,
    offset: ['start end', 'end start'],
  });
  const leftImageY = useTransform(scrollYProgress, [-0.5, 2], [100, -200]);
  const rightImageY = useTransform(scrollYProgress, [0, 2], [0, 200]);

  return (
    <>
      <div className="max-w-[1400px] mx-auto">
        <HeaderImg
          src="/marketing/who-we-are-header.webp"
          alt="Meadow"
          overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-16 mt-12 max-w-250 w-[90vw] mx-auto">
        <div className="space-y-8">
          <h1 className="text-left text-3xl md:text-4xl">{t('title')}</h1>

          <div className="font-light space-y-4">
            <p>{t('intro.paragraphs.0')}</p>
            <p>{t('intro.paragraphs.1')}</p>
            <p>{t('intro.paragraphs.2')}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-32">
          <h2 className="text-2xl md:text-3xl flex flex-col text-nowrap">
            <span>{t('culture.heading.line1')}</span>
            <span>{t('culture.heading.line2')}</span>
          </h2>

          <div className="flex flex-col font-light gap-4">
            <p>{t('culture.description')}</p>

            <Button
              variant="outline"
              className="rounded-4xl py-5 px-10 max-w-[200px] mx-auto"
            >
              <Link href="/careers">{t('culture.cta.careers')}</Link>
            </Button>
          </div>
        </div>

        <div
          ref={imageSectionRef}
          className="w-full mb-50 flex flex-col items-center h-fit py-8 md:py-10"
        >
          <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-20">
            <motion.div
              style={{ y: leftImageY }}
              className="w-full max-w-[350px] md:max-w-[460px] lg:max-w-[500px]"
            >
              <Image
                src="/marketing/who-we-are-people.png"
                alt=""
                width={500}
                height={500}
                sizes="(min-width: 1024px) 500px, (min-width: 768px) 460px, 100vw"
                className="h-auto w-full bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-sm"
              />
            </motion.div>
            <motion.div
              style={{ y: rightImageY }}
              className="w-full max-w-[350px] md:max-w-[460px] lg:max-w-[500px]"
            >
              <Image
                src="/marketing/who-we-are-people-2.png"
                alt=""
                width={500}
                height={500}
                sizes="(min-width: 1024px) 500px, (min-width: 768px) 460px, 100vw"
                className="h-auto w-full bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-sm"
              />
            </motion.div>
          </div>
        </div>

        <div className="space-y-16">
          <h2 className="text-2xl md:text-3xl">{t('competencies.title')}</h2>

          <div className="font-light flex flex-col justify-center items-center gap-16">
            <p>{t('competencies.items.0')}</p>
            <p>{t('competencies.items.1')}</p>
            <p>{t('competencies.items.2')}</p>
          </div>
        </div>

        <Button variant="ghost" className="mx-auto text-3xl my-32">
          <Link href="/what-we-do">{t('navigation.whatWeDo')}</Link>
        </Button>
      </div>
    </>
  );
}
