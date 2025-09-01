// Copyright Todd LLC, All rights reserved.

import { getRequestConfig } from 'next-intl/server';
import { routing } from './config';
import { messageFiles } from './message-files';

/**
 * Load and merge all message files for a given locale
 * @param {string} locale - The locale to load messages for
 * @returns {Promise<Record<string, unknown>>} - The merged messages
 */
export async function loadMessages(
  locale: string
): Promise<Record<string, unknown>> {
  const messages: Record<string, unknown> = {};

  // Load all message files in parallel and merge them
  const loadPromises = messageFiles.map(async (file) => {
    try {
      const fileMessages = (await import(`../messages/${file}/${locale}.json`))
        .default;
      Object.assign(messages, fileMessages);
    } catch (error) {
      console.warn(
        `Warning: Could not load message file ${file}/${locale}.json`,
        error
      );
    }
  });

  await Promise.all(loadPromises);
  return messages;
}

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

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
