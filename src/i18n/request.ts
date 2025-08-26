import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { env, SupportedLocale } from '@/lib/env';

export default getRequestConfig(async ({ locale }) => {
  // Handle cases where locale might be undefined (e.g., metadata generation)
  const resolvedLocale = locale || 'en';

  // Validate that the incoming locale is one of the supported locales
  if (!env.supportedLocales.includes(resolvedLocale as SupportedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale as string,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
