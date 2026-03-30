// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/common';
import HeaderImg from '@/components/common/header-img/header-img';
import { Link } from '@/i18n/config';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HiArrowLongRight } from 'react-icons/hi2';
import CompetenciesSection from './components/competencies-section/competencies-section';
import Partners from './components/partners';

/**
 * Who We Are page component
 * @returns {JSX.Element} - The who we are page
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
        >
          <HeaderImg
            src="/marketing/who-we-are-header.webp"
            alt="Meadow"
            overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
          />
        </motion.div>
      </div>
      <div className="flex flex-col mx-auto max-w-[1200px]">
        {/* Hero Text Section */}
        <motion.div
          className="w-full flex flex-col h-fit px-12 md:px-20 lg:px-26 py-16 lg:py-6"
          initial={{ opacity: 0.5, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex mb-16 flex-col max-w-[910px]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-[400px] md:max-w-[600px] lg:max-w-[800px] leading-tight font-light md:mb-6 mb-4 lg:mb-16 mt-4">
              {t('title')}
            </h1>
            <div className="text-sm md:text-normal lg:text-base font-light leading-relaxed space-y-4">
              <p>{t('intro.paragraphs.0')}</p>
              <p>{t('intro.paragraphs.1')}</p>
            </div>
          </div>
        </motion.div>
        {/* Culture Section */}
        <div className="w-full flex flex-col h-fit px-12 md:px-36 lg:px-26 py-8 md:py-6">
          <div className="flex flex-col gap-6 lg:flex-row md:justify-between lg:justify-around lg:gap-18 lg:max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-[200px] md:max-w-[250px] lg:max-w-[350px] leading-tight font-light md:basis-5/8">
              {t('culture.heading.line1')}
            </h2>
            <div className="flex items-left flex-col md:basis-2/3 items-left">
              <p className="text-normal md:text-base lg:text-lg font-thin leading-relaxed">
                {t('culture.description')}
              </p>

              <Button
                variant="outline"
                size="md"
                className="px-6 py-2 max-w-[210px] self-start font-thin mt-8"
                text={t('culture.cta.careers')}
                href="/careers?utm_source=who_we_are&utm_medium=internal&utm_campaign=careers_click"
                showArrow={true}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-16 flex flex-col items-center justify-center h-fit pt-24 md:pt-36 pb-8 md:pb-10 px-6 sm:px-8 md:px-12">
          <div className="flex justify-center w-full max-w-[700px]">
            <Image
              src="/marketing/who-we-are-img.jpg"
              alt="Team members"
              width={700}
              height={467}
              sizes="(min-width: 1024px) 700px, 100vw"
              className="h-auto w-full max-w-[700px] bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-sm"
            />
          </div>
        </div>
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
            href="/what-we-do?utm_source=who-we-are&utm_medium=internal&utm_campaign=what_we_do_click"
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
