// Copyright Todd LLC, All rights reserved.

import { getRequestConfig } from 'next-intl/server';
import { routing } from './config';

/**
 * Request configuration
 * @param {RequestLocale} requestLocale - The request locale
 * @returns {Promise<RequestConfig>} - The request configuration
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  //future: move to separate database or separated json files
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
