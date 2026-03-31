// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { HiArrowLongRight } from 'react-icons/hi2';
import HeaderImg from '../../../components/common/header-img/header-img';
import Faq from './components/faq/faq';

/**
 * This is the Creators page for the Todd go domain UGC Program.
 * @returns {JSX.Element} - The creators subdomain page
 */
export default function CreatorsPage() {
  const { scrollYProgress } = useScroll({
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [-0.5, 2], [100, -200]);

  const url =
    // eslint-disable-next-line no-secrets/no-secrets
    'https://docs.google.com/forms/d/e/1FAIpQLSfYqvSYKfTX-C4Cri3MNhB9ndhEN1_QNAAmaCBPNwvYaPCdAA/viewform?usp=header';

  return (
    <div className="max-w-[1400px] mx-auto">
      <HeaderImg
        src="/m4a.jpg"
        alt="garden"
        overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
      />
      <div>
        <div className="flex flex-col mx-auto max-w-[1450px]">
          {/* Creator Program Section*/}
          <motion.div
            className="w-full flex flex-col h-fit px-12 md:px-20 lg:px-26 lg:py-6"
            initial={{ opacity: 0.5, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <section className="flex flex-col w-full mb-2 lg:mb-8 border-b border-[#2A2727]/50">
              <div className="w-full flex flex-col h-fit px-4 md:px-8 lg:px-12 py-12 lg:py-6">
                <div className="flex mb-6 md:mb-10 lg:mb-16 flex-col max-w-[910px]">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-light mb-8 lg:mb-10 lg:mt-2">
                    Creator Program
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-[770px]">
                    Calling all publishers, creators, bloggers, and moggers!
                    <br />
                    <br />
                    Join the Todd Creator Program to monetize your content and
                    connect with the broader Todd community.
                  </p>
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={() => window.open(url, '_blank')}
                    className="h-12 w-[154px] lg:h-13 lg:w-[180px] font-thin mt-12 md:mt-16 rounded-full text-base lg:text-normal lg:text-lg"
                  >
                    Apply Now
                    <HiArrowLongRight
                      className="text-background"
                      style={{ width: 28, height: 28 }}
                    />
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>

          {/* How it works Section */}
          <section className="mx-auto w-[85%] lg:w-full">
            <div className="w-full flex flex-col h-fit px-6 md:px-24 lg:px-36 xl:px-48 py-8 md:py-6 mt-10 mb-16 lg:mb-16">
              <div className="flex flex-col gap-10 lg:flex-row lg:gap-28">
                <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-[200px] md:max-w-[250px] lg:max-w-[350px] leading-tight font-light shrink-0">
                  How it works
                </h2>
                <div className="flex flex-col">
                  <div className="text-normal md:text-base lg:text-lg font-thin leading-relaxed space-y-10">
                    <motion.div
                      initial={{ opacity: 0, x: 54 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1.3, ease: 'easeOut' }}
                      viewport={{ once: true, amount: 0.5 }}
                      className="flex gap-10"
                    >
                      <p className="text-4xl md:text-5xl lg:text-6xl leading-tight font-thin shrink-0">
                        01
                      </p>
                      <div className="flex flex-col gap-4 mt-1 md:mt-3">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-thin">
                          Apply
                        </p>
                        <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light text-foreground/90">
                          Get started by filling out your application (it only
                          takes a couple minutes). You can expect to hear back
                          from us within a couple days.
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 84 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1.3, ease: 'easeOut' }}
                      viewport={{ once: true, amount: 0.5 }}
                      className="flex gap-10"
                    >
                      <p className="text-4xl md:text-5xl lg:text-6xl leading-tight font-thin shrink-0">
                        02
                      </p>
                      <div className="flex flex-col gap-4 mt-1 md:mt-3">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-thin">
                          Connect
                        </p>
                        <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light text-foreground/90">
                          You know the drill. Once approved, we&apos;ll reach
                          out to you to setup, share our resources, and network
                          with our content team!
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 104 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1.3, ease: 'easeOut' }}
                      viewport={{ once: true, amount: 0.5 }}
                      className="flex gap-10"
                    >
                      <p className="text-4xl md:text-5xl lg:text-6xl leading-tight font-thin shrink-0">
                        03
                      </p>
                      <div className="flex flex-col gap-4 mt-1 md:mt-3">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-thin">
                          Earn
                        </p>
                        <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light text-foreground/90">
                          Get creative! You&apos;ll earn for each sucessful
                          referral you make (or per keyword review). We offer
                          competitive rates and offers.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="flex flex-col items-center justify-center mx-auto w-[90%] lg:w-full">
            <div className="w-full mr-37 md:mr-0 md:px-24 lg:px-36 xl:px-48 text-center md:text-left pt-16 md:pt-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-thin mb-10 md:mb-18">
                Benefits
              </h2>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 px-6 md:px-24 lg:px-36 xl:px-48 pb-16 md:pb-30 max-w-[300px] md:max-w-full">
              <div className="md:w-[80%]">
                <h3 className="text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Network with Todd&apos;s community
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed text-foreground/90 font-light">
                  Todd has a network of successful creators, founders, and
                  community builders! Our alumni include 8-figure startup
                  founders and million-follower YouTube creators.
                </p>
              </div>
              <div className="md:w-[80%]">
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Earn special offers throughout the year
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed text-foreground/90 font-light">
                  We&apos;ll share special offers and unique incentives with our
                  creators throughout the year. Top performers will receive
                  special perks and rewards.
                </p>
              </div>
              <div className="md:w-[80%]">
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Make content people actually engage with
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed text-foreground/90 font-light">
                  Todd branded content has historically performed well with Gen
                  Z and Millennial audiences who are aligned with our vision.
                  We&apos;ll help you create content that resonates with our
                  target audience.
                </p>
              </div>
              <div className="md:w-[80%]">
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal max-w-[300px]">
                  Attend exclusive events
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed text-foreground/90 font-light">
                  We host or sponsor in-person and virtual meetups throughout
                  the year, as well as hackathons and other creative challenges
                  with top talent in the country!
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <div className="mx-auto w-[85%] lg:w-full">
            <Faq />
          </div>
          {/* Apply Section */}
          <div className="w-full h-fit mt-16 lg:mt-20 mb-32 py-12 md:py-20 space-y-8 md:space-y-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-thin flex justify-center items-center">
              Help us make an impact on society.
            </h2>
            <Link
              href={url}
              target="_blank"
              className="text-3xl md:text-4xl lg:text-5xl leading-tight font-thin flex justify-center items-center gap-5"
            >
              Apply
              <span className="mt-1">
                <HiArrowLongRight className="size-12" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
