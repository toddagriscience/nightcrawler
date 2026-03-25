// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAnalyses } from './actions';
import AnalysesClient from './components/analyses-client';

/**
 * Analyses management page.
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function AnalysesPage() {
  const initialAnalyses = await getAnalyses();

  return <AnalysesClient initialAnalyses={initialAnalyses} />;
}
