// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Button from '@/components/common/button/button';
import { Disclaimer } from '@/components/common/disclaimer/disclaimer';
import HeaderImg from '@/components/common/header-img/header-img';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';
import Link from 'next/link';

/** The careers page. Currently only provides information on the externship and allows applicants to submit their email..
 *
 * @returns {JSX.Element} - The careers page. */
export default function Careers() {
  const t = useTranslations('externship');

  const imageSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageSectionRef,
    offset: ['start end', 'end start'],
  });
  const leftImageY = useTransform(scrollYProgress, [-0.5, 2], [100, -200]);
  const rightImageY = useTransform(scrollYProgress, [0, 2], [0, 200]);

  const url =
    // eslint-disable-next-line no-secrets/no-secrets
    'https://docs.google.com/forms/d/e/1FAIpQLSfi8yeNdjHuJCrO1sPSUhh8uCICsA6KGevRM-Mk9iND-aYkBQ/viewform';

  return (
    <>
      <div className="max-w-[520px] sm:max-w-[600px] md:max-w-[1200px] mx-auto text-center sm:text-left">
        <main className="flex flex-col mx-auto max-w-[1200px]">
          <HeaderImg
            src="/marketing/todd-university-xs-header.png"
            alt="Todd University"
            wrapperClassName="block md:hidden"
            imageClassName="transition-all duration-500 ease-in-out"
          />
          <HeaderImg
            src="/marketing/todd-university-header.png"
            alt="Todd University"
            wrapperClassName="hidden md:block"
            imageClassName="transition-all duration-500 ease-in-out"
          />
          {/* Hero Text Section */}
          <motion.div
            className="w-full mb-10 flex flex-col h-fit px-12 md:px-20 lg:px-26 py-16 lg:py-6"
            initial={{ opacity: 0.5, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex flex-col max-w-[800px]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-[400px] md:max-w-[600px] lg:max-w-[800px] leading-tight font-light md:mb-6 mb-4 lg:mb-16 mt-4">
                {t('title')}
              </h1>
              <p className="text-sm md:text-normal lg:text-base font-light leading-relaxed font-light max-w-[600px]">
                {t('subtitle')}
              </p>
            </div>
          </motion.div>

          {/* Our Program Section */}

          <div className="w-full mb-10 flex flex-col h-fit px-12 md:px-20 lg:px-26 py-8 md:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-0 max-w-[1000px]">
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-light md:basis-1/3">
                {t('program.title')}
              </h2>
              <p className="text-normal md:text-base lg:text-lg font-light leading-relaxed md:basis-2/3">
                {t('program.description')}
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div
            ref={imageSectionRef}
            className="w-full mb-80 flex flex-cols items-center h-fit py-8 md:py-10"
          >
            <div className="mx-auto flex w-full max-w-[850px] flex-col-reverse items-center gap-8 lg:flex-row lg:justify-center lg:gap-20">
              <motion.div
                style={{ y: rightImageY }}
                className="w-full max-w-[350px] md:max-w-[460px] lg:max-w-[500px]"
              >
                {/* Apply Section 
                - Closed: Show closed message and link to LinkedIn
                - Open: Show open message and button to apply
                */}
                <div className="flex flex-col gap-14 items-center sm:items-start md:justify-between max-w-[1000px]">
                  <h2 className="text-3xl md:text-3xl lg:text-4xl leading-normal font-thin max-w-[460px] lg:max-w-[350px]">
                    {t('applyClosed.title')}
                  </h2>
                  <p className="text-normal md:text-base lg:text-lg font-light leading-relaxed max-w-[300px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[600px]">
                    {t('applyClosed.description')}
                  </p>
                  <Link
                    href="https://www.linkedin.com/company/toddagriscience/"
                    target="_blank"
                    className="text-sm md:text-normal lg:text-base font-normal underline leading-relaxed max-w-[300px] md:max-w-[460px] lg:max-w-[600px]"
                  >
                    {t('applyClosed.linkText')}
                  </Link>

                  {/* Add application button back in when application period is open- currently closed */}
                  {/* <Button
                    className="max-w-[235px] w-[90vw] gap-6 font-thin"
                    text={t('apply.button')}
                    href={url}
                  /> */}
                </div>
              </motion.div>
              <motion.div
                style={{ y: leftImageY }}
                className="w-full max-w-[350px] md:max-w-[460px] lg:max-w-[500px]"
              >
                <Image
                  src="/marketing/careers-1.webp"
                  alt="Pink Lemonade"
                  width={500}
                  height={500}
                  sizes="(min-width: 1024px) 500px, (min-width: 768px) 460px, 100vw"
                  className="h-auto w-full bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-sm"
                />
              </motion.div>
            </div>
          </div>
          <div className="text-left">
            <Disclaimer
              translationLoc="careers.disclaimers"
              disclaimerCount={5}
            />
          </div>
        </main>
      </div>
    </>
  );
}
