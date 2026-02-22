// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';

/**
 * Legal subtext component. Renders legal subtext via next-intl.
 *
 * @returns {JSX.Element} - The legal subtext component, containing the account agreement, privacy policy, and terms of service links.
 * */
export function LegalSubtext() {
  const t = useTranslations('contactPage');

  return (
    <div className="flex flex-col gap-2 mb-5">
      <p className="text-xs font-thin">
        {t('legal.byContinuing')}{' '}
        <Link
          href="/account-agreement.pdf"
          target="_blank"
          className="underline font-normal"
        >
          {t('legal.accountAgreement')}
        </Link>{' '}
        {t('legal.and')}{' '}
        <Link href="/privacy" className="underline font-normal">
          {t('legal.privacyPolicy')}
        </Link>
        .
      </p>
      <p className="text-xs font-thin">
        <Link href="/terms" className="underline font-normal">
          {t('legal.termsOfService')}
        </Link>{' '}
        {t('legal.apply')}
      </p>
    </div>
  );
}
