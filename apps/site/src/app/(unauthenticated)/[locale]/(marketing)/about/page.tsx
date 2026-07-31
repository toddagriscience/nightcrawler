// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/common';
import HeaderImg from '@/components/common/header-img/header-img';
import PageHeader from '@/components/common/page-header/page-header';
import { Link } from '@/i18n/config';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HiArrowLongRight } from 'react-icons/hi2';
import CompetenciesSection from './components/competencies-section/competencies-section';
import Partners from './components/partners';

/**
 * About page component (formerly Who We Are)
 * @returns {JSX.Element} - The about page
 */
export default function WhoWeArePage() {
  const t = useTranslations('whoWeAre');

  return (
    <main>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="px-6 pt-16 md:px-10 md:pt-20 lg:pt-24"
        >
          <section className="mx-auto flex max-w-[1100px] flex-col items-center">
            <PageHeader
              caption={t('eyebrow')}
              title={t('title')}
              subtitle={t('subtitle')}
            />
          </section>
          <div className="mt-24 flex flex-col items-start gap-10 md:mt-32 md:flex-row md:justify-center md:gap-68">
            <div className="flex w-full max-w-[320px] flex-col items-start text-left">
              <h2 className="whitespace-pre-line text-2xl md:text-[28px] leading-snug font-normal">
                {t('vision.title')}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm md:text-base font-normal leading-relaxed">
                {t('vision.description')}
              </p>
              <Button
                variant="outline"
                size="md"
                className="px-6 py-2 max-w-[210px] font-thin mt-6"
                text={t('vision.cta')}
                href="/research"
                showArrow={true}
              />
            </div>
            <div className="flex w-full max-w-[380px] justify-center">
              <Image
                src="/marketing/aboutpagefamilyimage.jpg"
                alt={t('vision.imageAlt')}
                width={1440}
                height={1799}
                sizes="(min-width: 768px) 380px, 100vw"
                className="h-auto w-full rounded-sm object-cover"
              />
            </div>
          </div>
          <p className="mx-auto mt-24 max-w-[720px] text-center text-xl md:mt-32 md:text-2xl font-light leading-relaxed">
            {t('missionStatement')}
          </p>
          <div className="mt-16 md:mt-20">
            <HeaderImg
              src="/marketing/who-we-are-header.webp"
              alt="Meadow"
              overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
            />
          </div>
        </motion.div>
      </div>
      {/* Competencies Section */}
      <CompetenciesSection t={t} />
      <div className="flex flex-col mx-auto max-w-[1200px]">
        {/* Partners Section */}
        <motion.div
          className="w-full flex flex-col h-fit px-12 md:px-20 lg:px-26 py-16 lg:py-6"
          initial={{ opacity: 0.5, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Partners />
        </motion.div>

        <div className="w-full h-fit mb-16 md:mb-32 py-12 md:py-16">
          <Link
            href="/research"
            className="text-3xl md:text-4xl lg:text-4xl leading-tight font-thin flex justify-center items-center gap-5"
          >
            {t('navigation.whatWeDo')}
            <span className="mt-1">
              <HiArrowLongRight className="size-12" />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
