// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getArticlesByCollection } from '@/lib/sanity/articles';
import { getTranslations } from 'next-intl/server';

import { CareersJobList } from '../components/careers-job-list';

/**
 * Careers job listings from Sanity (links use `/careers/[slug]` or external ATS URLs).
 *
 * Public URL: **`/{locale}/careers/search`** (distinct from the hub at **`/{locale}/careers`**).
 *
 * @param params - Route params with locale
 * @returns Job listings or empty-state message
 */
export default async function CareersIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'careers' });

  const careerArticles = await getArticlesByCollection('careers');

  return (
    <section
      aria-labelledby="careers-at-todd-heading"
      className="mx-auto max-w-[1200px] px-4 pb-16 md:px-6"
    >
      <div className="fadeInAnimation relative mx-auto mt-12 w-full max-w-4xl">
        <h1
          id="careers-at-todd-heading"
          className="mb-14 text-center text-[64px] font-normal leading-tight tracking-tight text-black md:mb-16"
        >
          {t('metadata.title')}
        </h1>
        {careerArticles.length > 0 ? (
          <CareersJobList items={careerArticles} />
        ) : (
          <p className="mx-auto max-w-2xl px-0 text-center text-[#555555] md:text-lg">
            {t('jobListings.empty')}
          </p>
        )}
      </div>
    </section>
  );
}
