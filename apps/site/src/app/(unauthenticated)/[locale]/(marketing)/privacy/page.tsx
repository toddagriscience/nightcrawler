// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import CookiePreferencesModal from '@/components/common/cookie-preferences-modal/cookie-preferences-modal';
import {
  PolicyBody,
  PolicyItemHeading,
  PolicyList,
  PolicySection,
  PolicySubheading,
  TermsPoliciesPage,
} from '@/components/common/terms-policies-page';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/** Personal-information categories listed in the California supplement. */
const CALIFORNIA_CATEGORIES = [
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
] as const;

/** Consumer rights listed in the California supplement. */
const CALIFORNIA_RIGHTS = [
  'deletion',
  'disclosure',
  'correction',
  'noDiscrimination',
  'exercise',
] as const;

/** Border shared by the regional supplement sections. */
const SUPPLEMENT_DIVIDER = 'border-t border-[#2A2727]/20 pt-8';

/**
 * Privacy page component
 * @returns {JSX.Element} - The privacy page
 */
export default function PrivacyPage() {
  const t = useTranslations('privacy');

  /**
   * Builds an ordered list of translated strings from a numerically indexed key.
   * @param prefix - Message key prefix holding `0`, `1`, … entries
   * @param length - Number of entries to read
   * @returns The translated entries in order
   */
  const listFrom = (prefix: string, length: number) =>
    Array.from({ length }, (_, index) => t(`${prefix}.${index}`));

  return (
    <TermsPoliciesPage title={t('title')}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-6 text-xl font-light">{t('websitePrivacyPolicy')}</h2>
        <PolicyBody className="mb-4">{t('effective')}</PolicyBody>
        <div className="mt-8">
          <CookiePreferencesModal />
        </div>
      </div>

      {/* Supplements Notice */}
      <div className="mb-8">
        <PolicyList
          className="list-none space-y-2 pl-0"
          items={[
            t('supplements.california'),
            t('supplements.euUk'),
            t('supplements.japan'),
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <PolicySection title={t('commitment.title')}>
          <PolicyBody className="mb-4">{t('commitment.content')}</PolicyBody>
          <PolicyBody>{t('commitment.description')}</PolicyBody>
        </PolicySection>

        <PolicySection title={t('informationCollection.title')}>
          <div className="space-y-4">
            <PolicyBody>{t('informationCollection.general')}</PolicyBody>
            <PolicyBody>{t('informationCollection.usage')}</PolicyBody>
            <PolicyBody>{t('informationCollection.security')}</PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('jobApplicants.title')}>
          <PolicyBody>{t('jobApplicants.content')}</PolicyBody>
        </PolicySection>

        <PolicySection title={t('capacity.title')}>
          <PolicyBody>{t('capacity.content')}</PolicyBody>
        </PolicySection>

        <PolicySection title={t('notifications.title')}>
          <PolicyBody>{t('notifications.content')}</PolicyBody>
        </PolicySection>

        <PolicySection title={t('miscellaneous.title')}>
          <div className="space-y-4">
            <PolicyBody>{t('miscellaneous.termsReference')}</PolicyBody>
            <PolicyBody>{t('miscellaneous.headings')}</PolicyBody>
          </div>
        </PolicySection>

        {/* California Supplement */}
        <PolicySection
          title={t('california.title')}
          className={SUPPLEMENT_DIVIDER}
        >
          <PolicyBody className="mb-4">
            {t('california.lastUpdated')}
          </PolicyBody>

          <div className="space-y-6">
            <PolicyBody>{t('california.intro')}</PolicyBody>

            <div>
              <PolicyBody className="mb-4">
                {t('california.categoriesIntro')}
              </PolicyBody>

              {/* Categories Grid */}
              <div className="grid gap-4">
                {CALIFORNIA_CATEGORIES.map((category) => (
                  <div key={category} className="py-4">
                    <PolicyItemHeading className="mb-4 font-normal">
                      {t(`california.categories.${category}.title`)}
                    </PolicyItemHeading>
                    <PolicyBody className="mb-4">
                      {t(`california.categories.${category}.description`)}
                    </PolicyBody>
                    <PolicyBody>
                      Collected:{' '}
                      {t(`california.categories.${category}.collected`)}
                    </PolicyBody>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensitive Data Usage */}
            <div>
              <PolicyBody className="mb-2">
                {t('california.sensitiveDataUsage.intro')}
              </PolicyBody>
              <PolicyList
                items={listFrom('california.sensitiveDataUsage.purposes', 8)}
              />
            </div>

            <PolicyBody>{t('california.minorPolicy')}</PolicyBody>

            {/* Purposes */}
            <div>
              <PolicySubheading>
                {t('california.purposes.title')}
              </PolicySubheading>
              <PolicyList items={listFrom('california.purposes.list', 8)} />
            </div>

            <PolicyBody>{t('california.retention')}</PolicyBody>

            {/* Disclosure */}
            <div>
              <PolicySubheading>Disclosure of Information</PolicySubheading>
              <PolicyBody className="mb-2">
                {t('california.disclosure.intro')}
              </PolicyBody>
              <PolicyBody className="mb-2">
                {t('california.disclosure.businessPurpose')}
              </PolicyBody>
              <PolicyBody>{t('california.disclosure.thirdParties')}</PolicyBody>
            </div>

            {/* Rights */}
            <div>
              <PolicySubheading className="mb-4">
                {t('california.rights.title')}
              </PolicySubheading>
              <div className="space-y-4">
                {CALIFORNIA_RIGHTS.map((right) => (
                  <div key={right} className="py-4">
                    <PolicyItemHeading className="mb-2 leading-relaxed font-thin">
                      {t(`california.rights.${right}.title`)}
                    </PolicyItemHeading>
                    <PolicyBody>
                      {t(`california.rights.${right}.content`)}
                    </PolicyBody>
                    {right === 'disclosure' && (
                      <PolicyList
                        className="mt-2"
                        items={listFrom('california.rights.disclosure.list', 6)}
                      />
                    )}
                    {right === 'exercise' && (
                      <PolicyBody className="mt-2">
                        {t('california.rights.exercise.verification')}
                      </PolicyBody>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PolicySection>

        {/* Japan Supplement */}
        <PolicySection title={t('japan.title')}>
          <PolicyBody className="mb-4">{t('japan.lastUpdated')}</PolicyBody>
          <div className="space-y-6">
            <PolicyBody>{t('japan.intro')}</PolicyBody>
            <PolicySubheading>{t('japan.compliance.title')}</PolicySubheading>
            <PolicyBody>{t('japan.compliance.content')}</PolicyBody>
            <PolicySubheading>{t('japan.purposeOfUse.title')}</PolicySubheading>
            <PolicyBody>{t('japan.purposeOfUse.content')}</PolicyBody>
            <PolicyBody>{t('japan.businessDetails')}</PolicyBody>
            <PolicyBody className="ml-4">
              {t('japan.relatedBusiness')}
            </PolicyBody>
            <PolicyBody>{t('japan.purposeOfUse.subtitle')}</PolicyBody>
            <PolicyList items={listFrom('japan.purposeOfUse.purposes', 12)} />
            <PolicySubheading>{t('japan.safety.title')}</PolicySubheading>
            <PolicyBody>{t('japan.safety.content')}</PolicyBody>
            <PolicySubheading>{t('japan.ci.title')}</PolicySubheading>
            <PolicyBody>{t('japan.ci.content')}</PolicyBody>
            <PolicySubheading>
              {t('japan.requestDisclosure.title')}
            </PolicySubheading>
            <PolicyBody>{t('japan.requestDisclosure.content')}</PolicyBody>
            <PolicyBody>{t('japan.requestDisclosure.addition')}</PolicyBody>
            <PolicySubheading>
              {t('japan.informationRequest.title')}
            </PolicySubheading>
            <PolicyBody>{t('japan.informationRequest.content')}</PolicyBody>
            <PolicyBody>{t('japan.informationRequest.requestInfo')}</PolicyBody>
            <PolicyBody>{t('japan.informationRequest.addition')}</PolicyBody>
            <PolicyList
              ordered
              items={listFrom('japan.informationRequest.info', 7)}
            />
            <PolicySubheading>{t('japan.questions.title')}</PolicySubheading>
            <PolicyBody>
              {t('japan.questions.content')}
              <Link href={'/contact'} className="inline-block">
                : Contact us.
              </Link>
            </PolicyBody>
          </div>
        </PolicySection>

        {/* EU-UK Supplement */}
        <PolicySection title={t('euUk.title')} className={SUPPLEMENT_DIVIDER}>
          <PolicyBody className="mb-4">{t('euUk.lastUpdated')}</PolicyBody>

          <div className="space-y-6">
            <PolicyBody>{t('euUk.intro')}</PolicyBody>
            <PolicyBody>{t('euUk.definitions')}</PolicyBody>
            <PolicyBody>{t('euUk.scope')}</PolicyBody>

            <div>
              <PolicySubheading>
                {t('euUk.additionalInfo.title')}
              </PolicySubheading>
              <PolicyBody>{t('euUk.additionalInfo.content')}</PolicyBody>
            </div>

            <div>
              <PolicySubheading>{t('euUk.processing.title')}</PolicySubheading>
              <div className="space-y-3">
                <PolicyBody>{t('euUk.processing.legal')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.requirements')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.multipleBases')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.purposes')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.automated')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.disclosure')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.links')}</PolicyBody>
                <PolicyBody>{t('euUk.processing.legal')}</PolicyBody>
              </div>
            </div>

            <div>
              <PolicySubheading>{t('euUk.sharing.title')}</PolicySubheading>
              <PolicyBody className="mb-2">
                {t('euUk.sharing.content')}
              </PolicyBody>
            </div>

            <div>
              <PolicySubheading>{t('euUk.retention.title')}</PolicySubheading>
              <PolicyBody className="mb-2">
                {t('euUk.retention.security')}
              </PolicyBody>
              <PolicyBody>{t('euUk.retention.retention')}</PolicyBody>
            </div>

            <div>
              <PolicySubheading>{t('euUk.marketing.title')}</PolicySubheading>
              <PolicyBody className="mb-2">
                {t('euUk.marketing.content')}
              </PolicyBody>
              <PolicyBody className="mb-2">
                {t('euUk.marketing.optOut.intro')}
              </PolicyBody>
              <PolicyList
                items={listFrom('euUk.marketing.optOut.methods', 2)}
              />
            </div>

            <div>
              <PolicySubheading>{t('euUk.rights.title')}</PolicySubheading>
              <div className="space-y-3">
                <PolicyBody>{t('euUk.rights.list')}</PolicyBody>
                <PolicyBody>{t('euUk.rights.verification')}</PolicyBody>
              </div>
            </div>

            <div>
              <PolicySubheading>{t('euUk.complaints.title')}</PolicySubheading>
              <PolicyBody className="mb-2">
                {t('euUk.complaints.intro')}
              </PolicyBody>
              <PolicyList
                items={[t('euUk.complaints.uk'), t('euUk.complaints.eu')]}
              />
            </div>
          </div>
        </PolicySection>
      </div>
    </TermsPoliciesPage>
  );
}
