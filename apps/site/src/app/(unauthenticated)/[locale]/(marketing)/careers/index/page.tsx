// Copyright © Todd Agriscience, Inc. All rights reserved.

import { permanentRedirect } from 'next/navigation';

/**
 * Canonicalizes `/careers/index` to `/careers` so “job index” bookmarks and future nav
 * can target the index path while preserving a single careers landing URL.
 *
 * @param params - Route params including `locale`
 */
export default async function CareersIndexRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/careers`);
}
