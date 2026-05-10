// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getArticlesByCollection } from '@/lib/sanity/articles';

import { CareersExternship } from './components/careers-externship';
import { CareersOpenRolesList } from './components/careers-open-roles-list';

/**
 * Careers landing: Todd University externship plus open roles from Sanity (same URLs as `/index/[slug]` or external ATS).
 *
 * @returns Careers page sections
 */
export default async function CareersPage() {
  const careerArticles = await getArticlesByCollection('careers');
  const showCareersAtTodd = careerArticles.length > 0;

  return (
    <>
      <CareersExternship />
      {showCareersAtTodd ? (
        <section
          aria-labelledby="careers-at-todd-heading"
          className="max-w-[1200px] mx-auto px-4 md:px-6 pb-16"
        >
          <div className="fadeInAnimation relative z-10 mx-auto mt-12 lg:max-w-[95%] pb-4">
            <h2
              id="careers-at-todd-heading"
              className="md:px-6 px-4 mb-4 sm:mb-6 lg:mb-12 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
            >
              Careers at Todd
            </h2>
            <CareersOpenRolesList items={careerArticles} />
          </div>
        </section>
      ) : null}
    </>
  );
}
