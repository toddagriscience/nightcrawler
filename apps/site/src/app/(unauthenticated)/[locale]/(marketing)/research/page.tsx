// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NewsHighlightTilesSection } from '../components/news-highlight-tiles/news-highlight-tiles';
import ResearchLanding from './components/research-landing';

/**
 * Research hub at `/research`. A thin server shell so the highlight strip is
 * server-rendered and handed to the client body as a prop.
 *
 * @param params - Route params including locale
 */
export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <ResearchLanding
      highlights={
        <NewsHighlightTilesSection
          className="mb-20 md:mb-28"
          locale={locale}
          page="research"
          sectionId="research-highlights"
        />
      }
    />
  );
}
