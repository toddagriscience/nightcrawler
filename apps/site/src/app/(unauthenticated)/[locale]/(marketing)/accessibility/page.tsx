// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  PolicyBody,
  PolicySection,
  TermsPoliciesPage,
} from '@/components/common/terms-policies-page';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Accessibility',
};

/** Improvement entries rendered as bulleted paragraphs, in display order. */
const IMPROVEMENTS = [
  'textEquivalents',
  'keyboardAccess',
  'siteConsistency',
  'siteStructure',
  'links',
] as const;

/**
 * Accessibility page component
 * @returns {JSX.Element} - The accessibility page
 */
export default function AccessibilityPage() {
  const t = useTranslations('accessibility');

  return (
    <TermsPoliciesPage title={t('title')}>
      <PolicySection title={t('subtitle')}>
        <PolicyBody className="mb-8">{t('standards')}</PolicyBody>

        <PolicyBody className="mb-8">
          {t('improvements.description')}
        </PolicyBody>

        {IMPROVEMENTS.map((improvement) => (
          <PolicyBody key={improvement} className="mb-8">
            • {t(`improvements.${improvement}.title`)}
            {': '}
            {t(`improvements.${improvement}.content`)}
          </PolicyBody>
        ))}

        <PolicyBody className="mb-12">{t('cta')}</PolicyBody>
      </PolicySection>
    </TermsPoliciesPage>
  );
}
