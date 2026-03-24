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

  return (
    <div className="max-w-[1400px] mx-auto">
      <HeaderImg
        src="/meadow-4.webp"
        alt="Meadow"
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
              <div className="w-full flex flex-col h-fit px-4 md:px-8 lg:px-12 py-16 lg:py-6">
                <div className="flex mb-6 md:mb-10 lg:mb-16 flex-col max-w-[910px]">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-light mb-6 lg:mb-10 lg:mt-2">
                    Creator Program
                  </h1>
                  <p className="text-sm md:text-normal lg:text-base font-light leading-relaxed max-w-[770px]">
                    As a proud Partner of the NFL Leigue, Todd connects clients
                    and player to the heart of the game through unique
                    experiences, while supporting sustainable management
                    practices on and off the field.
                  </p>
                  <Button
                    variant="brand"
                    size="lg"
                    className="h-11 w-[144px] lg:h-13 lg:w-[180px] self-start font-thin mt-8 rounded-full text-base lg:text-normal lg:text-lg"
                  >
                    Apply Now
                    <HiArrowLongRight className="size-8 text-background" />
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>

          {/* How it works Section */}
          <section className="mx-auto w-[85%] lg:w-full">
            <div className="w-full flex flex-col h-fit px-6 md:px-24 lg:px-36 xl:px-48 py-8 md:py-6 mt-16 mb-16 lg:mb-20">
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-32">
                <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-[200px] md:max-w-[250px] lg:max-w-[350px] leading-tight font-light shrink-0">
                  How it works
                </h2>
                <div className="flex flex-col flex-1">
                  <div className="text-normal md:text-base lg:text-lg font-thin leading-relaxed space-y-4">
                    <p>
                      Todd attaches great importance to ensuring that its
                      suppliers and business partners as well as their
                      subcontractors share a set of common rules, practices and
                      principles with respect to ethics, social responsibility
                      and protection of the environment.
                    </p>
                    <p>
                      Todd therefore requires its suppliers and business
                      partners to respect the principles detailed in the
                      Supplier and Business Partner Code of Conduct and to
                      ensure that their own suppliers and subcontractors do the
                      same in the conduct of their activities for the Group.
                    </p>
                  </div>
                  <Link
                    href="#"
                    className="text-sm md:text-base font-thin leading-relaxed mt-6 underline hover:opacity-80"
                  >
                    &gt; Access the Supplier and Business Partner Code of
                    Conduct
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mx-auto w-[85%] lg:w-full ">
            <div className="w-full flex flex-col h-fit px-6 md:px-24 lg:px-36 xl:px-48 pt-16 md:pt-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-thin mb-10 md:mb-18">
                Benefits
              </h2>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 px-6 md:px-24 lg:px-36 xl:px-48 pb-16 md:pb-30 max-w-[300px] md:max-w-full">
              <div>
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Firm Representation
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light">
                  Todd is assembling a firm designed to mirror the consumer
                  bases of our farms, embracing a holistic pace of life that
                  nourishes the the na
                </p>
              </div>
              <div>
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Team Focus
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light">
                  We seek to instill responsibility and sustainability into our
                  values and culture and we strive to partner with
                  self-supporting fa
                </p>
              </div>
              <div>
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Farm Alignment and Integration
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light">
                  Agreement on and implementation of farm management practices
                  in an effort to achieve well-defined goals focused on
                  responsibility and sustainability.
                </p>
              </div>
              <div>
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-thin mb-4 tracking-normal">
                  Broader Communities
                </h3>
                <p className="text-sm md:text-normal lg:text-base leading-relaxed font-light">
                  We believe our farmers should seek to emulate and propel the
                  responsible and sustainable values of our Firm in the
                  communities they.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <div className="mx-auto w-[85%] lg:w-full">
            <Faq />
          </div>
          {/* Apply Section */}
          <div className="w-full h-fit mt-20 mb-32 py-12 md:py-20">
            <Link
              href="#"
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
