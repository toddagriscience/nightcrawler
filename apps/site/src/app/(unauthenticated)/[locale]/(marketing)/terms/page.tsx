// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  PolicyBody,
  PolicySection,
  TermsPoliciesPage,
} from '@/components/common/terms-policies-page';
import { useTranslations } from 'next-intl';

/**
 * Terms component
 * @returns {JSX.Element} - The terms page
 */
export default function TermsOfUsePage() {
  const t = useTranslations('terms');

  return (
    <TermsPoliciesPage title={t('title')}>
      <div className="space-y-12">
        <PolicySection title={t('termsAndConditions.title')}>
          <div className="space-y-8">
            <PolicyBody className="mb-8">
              {t('termsAndConditions.intro')}
            </PolicyBody>
            <PolicyBody className="mb-8">
              {t('termsAndConditions.amendments')}
            </PolicyBody>
            <PolicyBody className="mb-12">
              {t('termsAndConditions.ageRequirement')}
            </PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('purpose.title')}>
          <div className="space-y-8">
            <PolicyBody className="mb-8">
              {t('purpose.informational')}
            </PolicyBody>
            <PolicyBody className="mb-12">{t('purpose.noAdvice')}</PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('regulatory.title')}>
          <div className="space-y-8">
            <PolicyBody className="mb-8">
              {t('regulatory.noSolicitation')}
            </PolicyBody>
            <PolicyBody className="mb-12">
              {t('regulatory.forwardLooking')}
            </PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('privacyPolicies.title')}>
          <PolicyBody className="mb-12">
            {t('privacyPolicies.content')}
          </PolicyBody>
        </PolicySection>

        <PolicySection title={t('ownership.title')}>
          <PolicyBody className="mb-12">{t('ownership.content')}</PolicyBody>
        </PolicySection>

        <PolicySection title={t('thirdPartyLinks.title')}>
          <PolicyBody className="mb-12">
            {t('thirdPartyLinks.content')}
          </PolicyBody>
        </PolicySection>

        <PolicySection title={t('disclaimer.title')}>
          <div className="mb-12 rounded-lg">
            <PolicyBody>{t('disclaimer.content')}</PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('limitation.title')}>
          <div className="space-y-4 rounded-lg">
            <PolicyBody>{t('limitation.noLiability')}</PolicyBody>
            <PolicyBody>{t('limitation.noDamages')}</PolicyBody>
            <PolicyBody>{t('limitation.applicableLaw')}</PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('indemnity.title')}>
          <PolicyBody className="mb-12">{t('indemnity.content')}</PolicyBody>
        </PolicySection>

        <PolicySection title={t('claimsLimitation.title')}>
          <div className="mb-12 rounded-lg">
            <PolicyBody>{t('claimsLimitation.content')}</PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title={t('miscellaneous.title')}>
          <div className="space-y-8">
            <PolicyBody className="mb-8">
              {t('miscellaneous.assignment')}
            </PolicyBody>
            <PolicyBody className="mb-8">
              {t('miscellaneous.headings')}
            </PolicyBody>
          </div>
        </PolicySection>
      </div>
    </TermsPoliciesPage>
  );
}
