// Copyright Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers',
};

/**
 * Careers page component
 * @returns {JSX.Element} - The careers page
 */
export default function CareersPage() {
  const t = useTranslations('careers');

  return (
    <>
      <div className="mx-auto max-w-3xl px-2 pt-8">
        <h1 className="mt-16 mb-8 text-4xl font-light">{t('title')}</h1>
        <div className="mb-6 h-px bg-[#2A2727] opacity-20" />

        <h2 className="mb-6 text-xl font-light">{t('subtitle')}</h2>

        <p className="mb-8 text-sm leading-relaxed font-thin">
          {t('description')}
        </p>

        {/* Why Join Us Section */}
        <h2 className="mb-6 mt-12 text-2xl font-light">
          {t('whyJoinUs.title')}
        </h2>

        <div className="mb-8 space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-light">
              {t('whyJoinUs.innovation.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('whyJoinUs.innovation.content')}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-light">
              {t('whyJoinUs.growth.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('whyJoinUs.growth.content')}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-light">
              {t('whyJoinUs.culture.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('whyJoinUs.culture.content')}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-light">
              {t('whyJoinUs.impact.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('whyJoinUs.impact.content')}
            </p>
          </div>
        </div>

        {/* Open Positions Section */}
        <h2 className="mb-6 mt-12 text-2xl font-light">
          {t('openPositions.title')}
        </h2>

        <p className="mb-4 text-sm leading-relaxed font-thin">
          {t('openPositions.noPositions')}
        </p>

        <p className="mb-8 text-sm leading-relaxed font-thin">
          {t('openPositions.checkBack')}
        </p>

        {/* How to Apply Section */}
        <h2 className="mb-6 mt-12 text-2xl font-light">
          {t('howToApply.title')}
        </h2>

        <p className="mb-4 text-sm leading-relaxed font-thin">
          {t('howToApply.content')}
        </p>

        <p className="mb-4 text-sm leading-relaxed font-thin">
          {t('howToApply.contact')}
        </p>

        <Link
          href="/contact"
          className="inline-block text-sm font-thin text-[#2A2727] underline hover:opacity-70"
        >
          {t('howToApply.contactLink')}
        </Link>
      </div>
    </>
  );
}
