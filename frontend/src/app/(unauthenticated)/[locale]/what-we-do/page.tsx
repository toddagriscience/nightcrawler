// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Disclaimer } from '@/components/common/disclaimer/disclaimer';
import HeaderImg from '@/components/common/header-img/header-img';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';

/**
 * What We Do page component
 * @returns {JSX.Element} - The what we do page
 */
export default function WhatWeDoPage() {
  const t = useTranslations('whatWeDo');
  const imageSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageSectionRef,
    offset: ['start end', 'end start'],
  });
  const leftImageY = useTransform(scrollYProgress, [-0.5, 2], [100, -200]);
  const rightImageY = useTransform(scrollYProgress, [0, 2], [0, 200]);

  const principles = t.raw('principlesAndSustainability.principles') as Record<
    string,
    { title: string; description: string }
  >;

  const redefiningAgriculture = t.raw(
    'principlesAndSustainability.redefiningAgriculture'
  ) as Record<string, { title: string; description: string }>;

  return (
    <>
      <HeaderImg
        src="/meadow-4.webp"
        alt="Meadow"
        overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
      />
      <main className="flex flex-col mx-auto max-w-[1200px]">
        {/* Hero Text Section */}
        <motion.div
          className="w-full flex flex-col h-fit px-12 md:px-20 lg:px-26 py-16 lg:py-6"
          initial={{ opacity: 0.5, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex mb-10 flex-col max-w-[800px]">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-[400px] md:max-w-[600px] lg:max-w-[800px] leading-tight font-light md:mb-6 mb-4 lg:mb-16 mt-4">
              {t('title')}
            </h2>
            <p className="md:text-normal text-sm font-light leading-loose max-w-[600px]">
              {t('subtitle')}
            </p>
          </div>
        </motion.div>
        {/* Our Approach Section */}

        <div className="w-full mb-12 flex flex-col h-fit px-12 md:px-20 lg:px-26 py-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-0 max-w-[1000px]">
            <h2 className="text-3xl md:text-3xl lg:text-4xl leading-tight font-light md:basis-1/3">
              {t('approach.title')}
            </h2>
            <p className="text-sm md:text-base font-light leading-relaxed md:basis-2/3">
              {t('approach.description')}
            </p>
          </div>
        </div>
        {/* Image Section */}
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
                src="/pinklemonade.webp"
                alt="Farmer"
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
                src="/farmer.webp"
                alt="Pink Lemonade"
                width={500}
                height={500}
                sizes="(min-width: 1024px) 500px, (min-width: 768px) 460px, 100vw"
                className="h-auto w-full bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-sm"
              />
            </motion.div>
          </div>
        </div>
        {/* Our Strategy Section */}
        <div className="w-full flex flex-col h-fit px-12 md:px-36 lg:px-26 py-8 md:py-6">
          <div className="flex flex-col gap-6 lg:flex-row md:justify-between lg:justify-around lg:gap-50 lg:max-w-[1000px]">
            <h2 className="text-3xl md:text-3xl lg:text-4xl max-w-[200px] md:max-w-[250px] lg:max-w-[300px] leading-tight font-light md:basis-1/2">
              {t('strategy.title')}
            </h2>
            <p className="text-sm md:text-base font-light leading-relaxed md:basis-1/2">
              {t('strategy.description')}
            </p>
          </div>
        </div>
        {/* Principles Section */}
        <div className="w-full mb-32 gap-4 md:gap-6 lg:gap-10 flex flex-col md:flex-row flex-wrap justify-center h-fit px-12 md:px-20 lg:px-20 py-8 md:py-10">
          {Object.entries(principles).map(([key, principle]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="max-w-[320px] mx-auto border-none bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-2xl lg:text-3xl font-thin mb-2">
                    {principle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <CardDescription className="text-sm md:text-normal leading-relaxed font-light">
                    {principle.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Redefining Agriculture Section */}
        <div className="w-full flex flex-col justify-center text-center sm:text-left items-center md:items-start md:px-28 lg:px-40">
          <h2 className="text-3xl md:text-3xl lg:text-4xl max-w-[350px] lg:max-w-[500px] leading-tight font-thin">
            {t('principlesAndSustainability.redefiningAgriculture.title')}
          </h2>
        </div>
        {/* Redefining Agriculture Content */}
        <div className="w-full mb-20 gap-4 md:gap-6 lg:gap-6 grid grid-cols-1 md:grid-cols-2 justify-center h-fit px-12 md:px-20 lg:px-20 py-8 md:py-10">
          {Object.entries(redefiningAgriculture)
            .filter(
              ([, item]) =>
                typeof item === 'object' &&
                item !== null &&
                'description' in item
            )
            .map(([key, item]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="max-w-[350px] lg:max-w-[400px] mx-auto border-none bg-transparent shadow-none">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-2xl lg:text-3xl font-thin mb-2">
                      {(item as { title: string }).title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <CardDescription className="text-sm md:text-normal leading-relaxed font-light">
                      {(item as { description: string }).description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
        {/* Build a Better Farm Section */}
        <div className="w-full h-fit mb-16 md:mb-32 py-12 md:py-16">
          <Link
            href="/"
            className="text-3xl md:text-4xl lg:text-4xl leading-tight font-thin flex justify-center items-center gap-5"
          >
            {t('buildABetterFarm.title')}
            <span className="mt-1">
              <HiArrowLongRight className="size-12" />
            </span>
          </Link>
        </div>
        {/* Disclaimer Section */}
        <Disclaimer translationLoc="whatWeDo.disclaimers" disclaimerCount={5} />
      </main>
    </>
  );
}
