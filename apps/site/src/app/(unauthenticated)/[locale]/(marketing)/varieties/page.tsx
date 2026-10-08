// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getTranslations } from 'next-intl/server';
import { VarietyPublicList } from './components/variety-public-list';
import { getPublicVarieties } from './utils';

/**
 * Public index of varieties held in Todd's germplasm repository.
 *
 * Public URL: **`/{locale}/varieties`**.
 *
 * @param params - Route params with locale
 * @returns Variety list or empty-state message
 */
export default async function VarietiesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'varieties' });

  const varieties = await getPublicVarieties();

  return (
    <section
      aria-labelledby="general-variety-list-heading"
      className="mx-auto max-w-[1200px] px-4 pb-16 pt-25 md:px-6 md:pt-35"
    >
      <div className="fadeInAnimation relative mx-auto w-full max-w-4xl">
        <h1
          id="general-variety-list-heading"
          className="mb-8 text-center text-[clamp(2rem,calc(2rem+1*((100vw-23.4375rem)/66.5625)),3rem)] font-normal leading-[clamp(2.28rem,calc(2.28rem+0.72*((100vw-23.4375rem)/66.5625)),3rem)]"
        >
          {t('title')}
        </h1>
        <p className="mx-auto mb-6 max-w-2xl px-0 text-center text-[#555555] md:text-lg">
          {t('subtitle')}
        </p>
        <p className="mx-auto mb-14 max-w-2xl px-0 text-center text-[#555555] md:text-lg">
          {t('intro')}
        </p>
        {varieties.length > 0 ? (
          <VarietyPublicList items={varieties} />
        ) : (
          <p className="mx-auto max-w-2xl px-0 text-center text-[#555555] md:text-lg">
            {t('list.empty')}
          </p>
        )}
      </div>
    </section>
  );
}
