// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';

/**
 * Terms component
 * @returns {JSX.Element} - The terms page
 */

export default function TermsOfUsePage() {
  const t = useTranslations('terms');

  return (
    <div className="mx-auto max-w-3xl px-2 pt-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-8 text-4xl font-light">{t('title')}</h1>
        <div className="mb-6 h-px bg-[#2A2727] opacity-20" />
      </div>

      {/* Main Content */}
      <div className="space-y-12">
        {/* Terms and Conditions Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('termsAndConditions.title')}
          </h2>
          <div className="space-y-8">
            <p className="mb-8 text-sm leading-relaxed font-thin">
              {t('termsAndConditions.intro')}
            </p>
            <p className="mb-8 text-sm leading-relaxed font-thin">
              {t('termsAndConditions.amendments')}
            </p>
            <p className="mb-12 text-sm leading-relaxed font-thin">
              {t('termsAndConditions.ageRequirement')}
            </p>
          </div>
        </section>

        {/* Purpose Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('purpose.title')}</h2>
          <div className="space-y-8">
            <p className="mb-8 text-sm leading-relaxed font-thin">
              {t('purpose.informational')}
            </p>
            <p className="mb-12 text-sm leading-relaxed font-thin">
              {t('purpose.noAdvice')}
            </p>
          </div>
        </section>

        {/* Regulatory Disclosures Section */}
        <section>
          <h2 className="mb-6 text-xl font-light ">{t('regulatory.title')}</h2>
          <div className="space-y-8">
            <p className="mb-8 text-sm leading-relaxed font-thin">
              {t('regulatory.noSolicitation')}
            </p>
            <p className="mb-12 text-sm leading-relaxed font-thin">
              {t('regulatory.forwardLooking')}
            </p>
          </div>
        </section>

        {/* Privacy Policies Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('privacyPolicies.title')}
          </h2>
          <p className="mb-12 text-sm leading-relaxed font-thin">
            {t('privacyPolicies.content')}
          </p>
        </section>

        {/* Ownership Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('ownership.title')}</h2>
          <p className="mb-12 text-sm leading-relaxed font-thin">
            {t('ownership.content')}
          </p>
        </section>

        {/* Third-Party Links Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('thirdPartyLinks.title')}
          </h2>
          <p className="mb-12 text-sm leading-relaxed font-thin">
            {t('thirdPartyLinks.content')}
          </p>
        </section>

        {/* Disclaimer Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('disclaimer.title')}</h2>
          <div className="mb-12 rounded-lg">
            <p className="text-sm leading-relaxed font-thin">
              {t('disclaimer.content')}
            </p>
          </div>
        </section>

        {/* Limitation of Liability Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('limitation.title')}</h2>
          <div className="space-y-4 rounded-lg">
            <p className="text-sm leading-relaxed font-thin">
              {t('limitation.noLiability')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('limitation.noDamages')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('limitation.applicableLaw')}
            </p>
          </div>
        </section>

        {/* Indemnity Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('indemnity.title')}</h2>
          <p className="mb-12 text-sm leading-relaxed font-thin">
            {t('indemnity.content')}
          </p>
        </section>

        {/* Claims Limitation Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('claimsLimitation.title')}
          </h2>
          <div className="mb-12 rounded-lg">
            <p className="text-sm leading-relaxed font-thin">
              {t('claimsLimitation.content')}
            </p>
          </div>
        </section>

        {/* Miscellaneous Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('miscellaneous.title')}
          </h2>
          <div className="space-y-8">
            <p className="mb-8 text-sm leading-relaxed font-thin">
              {t('miscellaneous.assignment')}
            </p>
            <p className="mb-8 text-sm leading-relaxed font-thin">
              {t('miscellaneous.headings')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
