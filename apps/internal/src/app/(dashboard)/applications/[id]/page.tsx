// Copyright © Todd Agriscience, Inc. All rights reserved.

export const dynamic = 'force-dynamic';

import { buildIncomingSignupUrl } from '@/lib/platform-access/build-incoming-signup-url';
import { notFound } from 'next/navigation';
import { getPlatformAccessApplicationById } from '../actions';
import ApplicationDetailClient from '../components/application-detail-client';

/** Base URL for generated signup links. */
function getSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ??
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

/**
 * Platform access application detail page.
 *
 * @param params - Dynamic application id segment
 */
export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applicationId = Number.parseInt(id, 10);

  if (!Number.isFinite(applicationId)) {
    notFound();
  }

  const application = await getPlatformAccessApplicationById(applicationId);
  if (!application) {
    notFound();
  }

  const signupUrl =
    application.status === 'approved'
      ? buildIncomingSignupUrl(
          getSiteBaseUrl(),
          (application.answers ?? {}) as Record<string, unknown>,
          {
            applicationId: application.id,
            signupToken: application.signupToken ?? undefined,
          }
        )
      : null;

  return (
    <ApplicationDetailClient application={application} signupUrl={signupUrl} />
  );
}
