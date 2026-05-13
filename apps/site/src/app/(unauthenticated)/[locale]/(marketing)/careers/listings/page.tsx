// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getArticlesByCollection } from '@/lib/sanity/articles';
import { getTranslations } from 'next-intl/server';

import { CareersJobList } from '../components/careers-job-list';

/**
 * Careers postings from Sanity (links use `/careers/[slug]` or external ATS URLs).
 *
 * Public URL is **`/careers/index`** via middleware rewrite (implementation lives here because the App Router
 * cannot expose both `/careers` and `/careers/index` from filesystem routes alone).
 *
 * @param params - Route params with locale
 * @returns Job listings or empty-state message
 */
export default async function CareersListingsPage({
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
      className="max-w-[1200px] mx-auto px-4 md:px-6 pb-16"
    >
      <div className="fadeInAnimation relative z-10 mx-auto mt-12 lg:max-w-[95%] pb-4">
        <h2
          id="careers-at-todd-heading"
          className="md:px-6 px-4 mb-4 sm:mb-6 lg:mb-12 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
        >
          {t('metadata.title')}
        </h2>
        {careerArticles.length > 0 ? (
          <CareersJobList items={careerArticles} />
        ) : (
          <p className="mx-auto max-w-2xl px-4 text-center text-[#555555] md:text-lg">
            {t('jobListings.empty')}
          </p>
        )}
      </div>
    </section>
  );
}
