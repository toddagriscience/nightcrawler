// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import HeaderImg from '@/components/common/header-img/header-img';
import PageHeader from '@/components/common/page-header/page-header';
import { Button } from '@/components/ui';
import { Link } from '@/i18n/config';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HiArrowLongRight } from 'react-icons/hi2';
import type { ReactNode } from 'react';
import CompetenciesSection from './competencies-section/competencies-section';
import Partners from './partners';
import ResponsibilitiesSection from './responsibilities-section/responsibilities-section';

/**
 * About page body (formerly Who We Are). Client-side because of the entrance
 * animations; the server-rendered highlight strip arrives as `highlights`.
 *
 * @param props.highlights - Highlight strip node rendered above the closing link
 * @returns {JSX.Element} - The about page body
 */
export default function AboutLanding({
  highlights,
}: {
  highlights?: ReactNode;
}) {
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
          <div className="mx-auto mt-24 flex w-[85%] flex-col justify-center gap-10 md:mt-32 md:flex-row md:justify-center lg:gap-40">
            <div className="flex w-full max-w-[400px] flex-col items-start text-left">
              <h2 className="whitespace-pre-line text-2xl md:text-3xl/[38px] leading-snug font-normal">
                {t('vision.title')}
              </h2>
              <p className="mt-6 whitespace-pre-line text-base md:text[17px]/[28px] font-normal leading-relaxed">
                {t('vision.description')}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-16 md:mt-26 mb-16 h-[47px] min-w-[159px] rounded-full border-[0.75px] border-[#848484] px-5 text-[16px]/[40px] [&_svg]:size-4"
                size="lg"
              >
                <Link href="/research">
                  {t('vision.cta')}
                  <HiArrowLongRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="flex w-full max-w-[580px] justify-center">
              <Image
                src="/marketing/about-family.jpg"
                alt={t('vision.imageAlt')}
                width={1440}
                height={1799}
                sizes="(min-width: 768px) 580px, 100vw"
                className="h-[320px] w-full rounded-sm object-cover md:h-[580px]"
              />
            </div>
          </div>
          <p className="mx-auto mt-30 max-w-lg md:max-w-2xl lg:max-w-[850px] text-center text-2xl md:text-3xl/[38px] md:mt-46 font-regular">
            {t('missionStatement')}
          </p>
          <div className="mt-20 md:mt-27">
            <HeaderImg
              src="/marketing/who-we-are-header.webp"
              alt="Meadow"
              overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
            />
          </div>
        </motion.div>
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
      </div>
      {/* Competencies Section */}
      <CompetenciesSection t={t} />
      {/* Responsibilities Section */}
      <ResponsibilitiesSection t={t} />
      <div className="flex flex-col mx-auto max-w-[1200px]">
        {/* Highlighted Articles Section */}
        {highlights}
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
