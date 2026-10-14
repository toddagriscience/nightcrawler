// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NewsHighlightTilesSection } from '../components/news-highlight-tiles/news-highlight-tiles';
import AboutLanding from './components/about-landing';

/**
 * About hub at `/about`. A thin server shell so the highlight strip is
 * server-rendered and handed to the client body as a prop.
 *
 * @param params - Route params including locale
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <AboutLanding
      highlights={
        <NewsHighlightTilesSection
          className="pt-12 md:pt-16"
          locale={locale}
          page="about"
          sectionId="about-highlights"
        />
      }
    />
  );
}
