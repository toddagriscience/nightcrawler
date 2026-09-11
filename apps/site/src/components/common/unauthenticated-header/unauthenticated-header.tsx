// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';

/**
 * Minimalistic header component for unauthenticated pages
 * Displays the TODD brand and navigation link to the contact page
 *
 * This header renders both inside and outside the `[locale]` tree. Only the
 * localized pages have a `NextIntlClientProvider`, and next-intl's locale-aware
 * `Link` throws without one, so the caller states which tree it is in:
 * pass `localeAware` from a localized layout, omit it everywhere else.
 *
 * @param {boolean} localeAware - Keep the home link in the current locale (localized pages only)
 * Displays the TODD brand
 * @returns {JSX.Element} - The unauthenticated header component
 */
export default function UnauthenticatedHeader({
  localeAware = false,
}: {
  localeAware?: boolean;
} = {}) {
  return (
    <header className="w-full sm:mt-4" role="banner">
      <div className="mx-auto max-w-[107rem] mt-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13">
          <ToddHeader
            className="flex min-h-10 flex-row items-center"
            localeAware={localeAware}
          />
        </div>
      </div>
    </header>
  );
}
