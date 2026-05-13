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
      className="mx-auto max-w-[1200px] pl-4 pb-16 md:pl-6 pr-0"
    >
      <div className="fadeInAnimation relative z-10 mt-12 ml-auto mr-0 w-full max-w-4xl">
        <h1
          id="careers-at-todd-heading"
          className="mb-14 text-center text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl"
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
