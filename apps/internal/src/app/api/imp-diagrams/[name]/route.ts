// Copyright © Todd Agriscience, Inc. All rights reserved.

import { requireInternalAccount } from '@/lib/require-internal-account';
import { logger } from '@/lib/logger';
import { getImpDiagram } from '@nightcrawler/db/utils/imp-diagram-storage';
import { impDiagramNamePattern } from '@nightcrawler/db/utils/imp-diagram';

/** Staff may preview newly uploaded private images before saving their IMP. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await requireInternalAccount();
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized')
      return new Response('Unauthorized', { status: 401 });
    logger.error('Failed to authorize IMP diagram:', error);
    return new Response('Unable to authorize image', { status: 503 });
  }
  const { name } = await params;
  if (!impDiagramNamePattern.test(name))
    return new Response('Not found', { status: 404 });
  try {
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
    logger.error('Failed to read IMP diagram:', error);
    return new Response('Unable to load image', { status: 503 });
  }
}
