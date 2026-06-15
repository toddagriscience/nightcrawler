// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link as LocaleLink } from '@/i18n/config';
import Image from 'next/image';
import NextLink from 'next/link';
import Wordmark from '@public/wordmark.svg';

/**
 * Small helper for the TODD logo, linking to the homepage.
 *
 * On localized pages (the marketing/contact tree wrapped in
 * `NextIntlClientProvider`) pass `localeAware` so the home link keeps the user
 * in their current locale (e.g. `/es`) instead of dropping them on the
 * default-locale home. On the unlocalized platform and `(go)` pages — which
 * have no intl provider — omit it to render a plain link and avoid a
 * missing-context error.
 *
 * @param {string} className - Optional class names
 * @param {boolean} localeAware - Use a locale-aware home link (localized pages only)
 * @returns {JSX.Element} - The logo, with a link to the homepage
 */
export default function ToddHeader({
  className = '',
  localeAware = false,
}: {
  className?: string;
  localeAware?: boolean;
}) {
  const sharedProps = {
    href: '/',
    className: `wordmark leading-none ${className}`,
    'data-testid': 'wordmark-link',
    'aria-label': 'Todd Agriscience home page',
  };

  const logo = (
    <Image
      src={Wordmark}
      alt=""
      className="object-contain"
      width={76}
      height={40}
    />
  );

  return localeAware ? (
    <LocaleLink {...sharedProps}>{logo}</LocaleLink>
  ) : (
    <NextLink {...sharedProps}>{logo}</NextLink>
  );
}
