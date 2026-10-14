// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getUserEmail } from '@/lib/auth-server';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { logger } from '@/lib/logger';
import { canReadImpDiagram } from '@nightcrawler/db/queries';
import { getImpDiagram } from '@nightcrawler/db/utils/imp-diagram-storage';
import { impDiagramNamePattern } from '@nightcrawler/db/utils/imp-diagram';

/** Serves published diagrams only to approved clients with access to the practice. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!impDiagramNamePattern.test(name))
    return new Response('Not found', { status: 404 });
  try {
    if (!(await getUserEmail()))
      return new Response('Unauthorized', { status: 401 });
    const currentUser = await getAuthenticatedInfo();
    if (
      !currentUser.approved ||
      (currentUser.role === 'Viewer' &&
        !(await hasAcceptedAccountAgreement(currentUser.id)))
    )
      return new Response('Forbidden', { status: 403 });
    if (!(await canReadImpDiagram(name, currentUser.farmId)))
      return new Response('Not found', { status: 404 });
    const { bytes, contentType } = await getImpDiagram(name);
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'NoSuchKey')
      return new Response('Not found', { status: 404 });
    logger.error('Failed to serve client IMP diagram:', error);
    return new Response('Unable to load image', { status: 503 });
  }
}
