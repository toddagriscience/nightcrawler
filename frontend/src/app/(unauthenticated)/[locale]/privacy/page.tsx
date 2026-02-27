// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import CookiePreferencesModal from '@/components/common/cookie-preferences-modal/cookie-preferences-modal';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/**
 * Privacy page component
 * @returns {JSX.Element} - The privacy page
 */
export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
    <div className="mx-auto max-w-3xl px-2 pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mt-16 mb-8 text-4xl font-light">{t('title')}</h1>
        <div className="mb-6 h-px bg-[#2A2727] opacity-20" />
        <h2 className="mb-6 text-xl font-light">{t('websitePrivacyPolicy')}</h2>
        <p className="mb-4 text-sm leading-relaxed font-thin">
          {t('effective')}
        </p>
        <div className="mt-8">
          <CookiePreferencesModal />
        </div>
      </div>

      {/* Supplements Notice */}
      <div className="mb-8">
        <ul className="space-y-2 text-sm leading-relaxed font-thin">
          <li>{t('supplements.california')}</li>
          <li>{t('supplements.euUk')}</li>
          <li>{t('supplements.japan')}</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Commitment Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('commitment.title')}</h2>
          <p className="mb-4 text-sm leading-relaxed font-thin">
            {t('commitment.content')}
          </p>
          <p className="text-sm leading-relaxed font-thin">
            {t('commitment.description')}
          </p>
        </section>

        {/* Information Collection Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('informationCollection.title')}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed font-thin">
            <p>{t('informationCollection.general')}</p>
            <p>{t('informationCollection.usage')}</p>
            <p>{t('informationCollection.security')}</p>
          </div>
        </section>

        {/* Job Applicants Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('jobApplicants.title')}
          </h2>
          <p className="text-sm leading-relaxed font-thin">
            {t('jobApplicants.content')}
          </p>
        </section>

        {/* Capacity Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('capacity.title')}</h2>
          <p className="text-sm leading-relaxed font-thin">
            {t('capacity.content')}
          </p>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('notifications.title')}
          </h2>
          <p className="text-sm leading-relaxed font-thin">
            {t('notifications.content')}
          </p>
        </section>

        {/* Miscellaneous Section */}
        <section>
          <h2 className="mb-6 text-xl font-light">
            {t('miscellaneous.title')}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed font-thin">
            <p>{t('miscellaneous.termsReference')}</p>
            <p>{t('miscellaneous.headings')}</p>
          </div>
        </section>

        {/* California Supplement */}
        <section className="border-t border-[#2A2727]/20 pt-8">
          <h2 className="mb-6 text-xl font-light">{t('california.title')}</h2>
          <p className="mb-4 text-sm leading-relaxed font-thin">
            {t('california.lastUpdated')}
          </p>

          <div className="space-y-6">
            <p className="text-sm leading-relaxed font-thin">
              {t('california.intro')}
            </p>

            <div>
              <p className="mb-4 text-sm leading-relaxed font-thin">
                {t('california.categoriesIntro')}
              </p>

              {/* Categories Grid */}
              <div className="grid gap-4">
                {[
                  'identifiers',
                  'personalRecords',
                  'protectedCharacteristics',
                  'commercialInfo',
                  'biometricInfo',
                  'internetActivity',
                  'geolocation',
                  'sensoryData',
                  'professionalInfo',
                  'educationInfo',
                  'inferences',
                  'sensitiveInfo',
                ].map((category) => (
                  <div key={category} className="py-4">
                    <h4 className="mb-4 text-sm font-normal">
                      {t(`california.categories.${category}.title`)}
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed font-thin">
                      {t(`california.categories.${category}.description`)}
                    </p>
                    <p className="text-sm leading-relaxed font-thin">
                      Collected:{' '}
                      {t(`california.categories.${category}.collected`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensitive Data Usage */}
            <div>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('california.sensitiveDataUsage.intro')}
              </p>
              <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed font-thin">
                {Array.from({ length: 8 }, (_, i) => (
                  <li key={i} className="text-sm">
                    {t(`california.sensitiveDataUsage.purposes.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm leading-relaxed font-thin">
              {t('california.minorPolicy')}
            </p>

            {/* Purposes */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('california.purposes.title')}
              </h3>
              <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed font-thin">
                {Array.from({ length: 8 }, (_, i) => (
                  <li key={i} className="text-sm">
                    {t(`california.purposes.list.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm leading-relaxed font-thin">
              {t('california.retention')}
            </p>

            {/* Disclosure */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                Disclosure of Information
              </h3>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('california.disclosure.intro')}
              </p>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('california.disclosure.businessPurpose')}
              </p>
              <p className="text-sm leading-relaxed font-thin">
                {t('california.disclosure.thirdParties')}
              </p>
            </div>

            {/* Rights */}
            <div>
              <h3 className="mb-4 text-lg font-light">
                {t('california.rights.title')}
              </h3>
              <div className="space-y-4">
                {[
                  'deletion',
                  'disclosure',
                  'correction',
                  'noDiscrimination',
                  'exercise',
                ].map((right) => (
                  <div key={right} className="py-4">
                    <h4 className="mb-2 text-sm leading-relaxed font-thin">
                      {t(`california.rights.${right}.title`)}
                    </h4>
                    <p className="text-sm leading-relaxed font-thin">
                      {t(`california.rights.${right}.content`)}
                    </p>
                    {right === 'disclosure' && (
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-relaxed font-thin">
                        {Array.from({ length: 6 }, (_, i) => (
                          <li key={i} className="text-sm">
                            {t(`california.rights.disclosure.list.${i}`)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {right === 'exercise' && (
                      <p className="mt-2 text-sm leading-relaxed font-thin">
                        {t('california.rights.exercise.verification')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Japan section */}
        <section>
          <h2 className="mb-6 text-xl font-light">{t('japan.title')}</h2>
          <p className="mb-4 text-sm leading-relaxed font-thin">
            {t('japan.lastUpdated')}
          </p>
          <div className="space-y-6">
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.intro')}
            </p>
            <h3 className="mb-3 text-lg font-light">
              {t('japan.compliance.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.compliance.content')}
            </p>
            <h3 className="mb-3 text-lg font-light">
              {t('japan.purposeOfUse.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.purposeOfUse.content')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.businessDetails')}
            </p>
            <p className="ml-4 text-sm leading-relaxed font-thin">
              {t('japan.relatedBusiness')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.purposeOfUse.subtitle')}
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed font-thin">
              {Array.from({ length: 12 }, (_, i) => (
                <li key={i} className="text-sm">
                  {t(`japan.purposeOfUse.purposes.${i}`)}
                </li>
              ))}
            </ul>
            <h3 className="mb-3 text-lg font-light">
              {t('japan.safety.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.safety.content')}
            </p>
            <h3 className="mb-3 text-lg font-light">{t('japan.ci.title')}</h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.ci.content')}
            </p>
            <h3 className="mb-3 text-lg font-light">
              {t('japan.requestDisclosure.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.requestDisclosure.content')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.requestDisclosure.addition')}
            </p>
            <h3 className="mb-3 text-lg font-light">
              {t('japan.informationRequest.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.informationRequest.content')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.informationRequest.requestInfo')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.informationRequest.addition')}
            </p>
            <ol className="list-decimal space-y-1 pl-6 text-sm leading-relaxed font-thin">
              {Array.from({ length: 7 }, (_, i) => (
                <li key={i} className="text-sm">
                  {t(`japan.informationRequest.info.${i}`)}
                </li>
              ))}
            </ol>
            <h3 className="mb-3 text-lg font-light">
              {t('japan.questions.title')}
            </h3>
            <p className="text-sm leading-relaxed font-thin">
              {t('japan.questions.content')}
              <Link href={'/contact'} className="inline-block">
                : Contact us.
              </Link>
            </p>
          </div>
        </section>

        {/* EU-UK Section */}
        <section className="border-t border-[#2A2727]/20 pt-8">
          <h2 className="mb-6 text-xl font-light">{t('euUk.title')}</h2>
          <p className="mb-4 text-sm leading-relaxed font-thin">
            {t('euUk.lastUpdated')}
          </p>

          <div className="space-y-6">
            <p className="text-sm leading-relaxed font-thin">
              {t('euUk.intro')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('euUk.definitions')}
            </p>
            <p className="text-sm leading-relaxed font-thin">
              {t('euUk.scope')}
            </p>

            {/* Additional Information */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.additionalInfo.title')}
              </h3>
              <p className="text-sm leading-relaxed font-thin">
                {t('euUk.additionalInfo.content')}
              </p>
            </div>

            {/* Purpose of Processing */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.processing.title')}
              </h3>
              <div className="space-y-3 text-sm leading-relaxed font-thin">
                <p>{t('euUk.processing.legal')}</p>
                <p>{t('euUk.processing.requirements')}</p>
                <p>{t('euUk.processing.multipleBases')}</p>
                <p>{t('euUk.processing.purposes')}</p>
                <p>{t('euUk.processing.automated')}</p>
                <p>{t('euUk.processing.disclosure')}</p>
                <p>{t('euUk.processing.links')}</p>
                <p>{t('euUk.processing.legal')}</p>
              </div>
            </div>

            {/* Sharing and Transfers */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.sharing.title')}
              </h3>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('euUk.sharing.content')}
              </p>
            </div>

            {/* Retention and Security */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.retention.title')}
              </h3>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('euUk.retention.security')}
              </p>
              <p className="text-sm leading-relaxed font-thin">
                {t('euUk.retention.retention')}
              </p>
            </div>

            {/* Direct Communications */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.marketing.title')}
              </h3>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('euUk.marketing.content')}
              </p>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('euUk.marketing.optOut.intro')}
              </p>
              <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed font-thin">
                {Array.from({ length: 2 }, (_, i) => (
                  <li key={i} className="text-sm">
                    {t(`euUk.marketing.optOut.methods.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rights */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.rights.title')}
              </h3>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed font-thin">
                  {t('euUk.rights.list')}
                </p>
                <p className="text-sm leading-relaxed font-thin">
                  {t('euUk.rights.verification')}
                </p>
              </div>
            </div>

            {/* Complaints */}
            <div>
              <h3 className="mb-3 text-lg font-light">
                {t('euUk.complaints.title')}
              </h3>
              <p className="mb-2 text-sm leading-relaxed font-thin">
                {t('euUk.complaints.intro')}
              </p>
              <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed font-thin">
                <li className="text-sm">{t('euUk.complaints.uk')}</li>
                <li className="text-sm">{t('euUk.complaints.eu')}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
