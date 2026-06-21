// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { requirePlatformOnboardingComplete } from '@/lib/utils/platform-onboarding';
import { getVarietiesGroupedByCrop } from './utils';
import { VarietyBrowse } from './components/variety-browse';

export const metadata: Metadata = {
  title: 'Varieties | Todd',
};

/**
 * Authenticated variety discovery page. Lists every variety in the seed
 * inventory, grouped by crop, with client-side search, status filtering, and a
 * list/grid layout toggle.
 */
export default async function VarietiesPage() {
  await requirePlatformOnboardingComplete();

  const groups = await getVarietiesGroupedByCrop();

  return <VarietyBrowse groups={groups} />;
}
