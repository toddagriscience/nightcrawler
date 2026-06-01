// Copyright © Todd Agriscience, Inc. All rights reserved.

import { logger } from '@/lib/logger';

/**
 * Boots the New Relic Node agent on the Node.js server runtime only (not Edge), after Next has
 * applied environment files such as `.env.local`.
 *
 * Does not load the agent when New Relic is disabled via env or when the ingest license key
 * env var is missing, so local runs without a key avoid New Relic’s hard startup error.
 *
 * The agent is loaded from `newrelic-agent.cjs` in this directory so the Next instrumentation
 * entry file does not import `node:module`, which Turbopack would otherwise flag for the Edge Runtime graph.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (process.env.NEW_RELIC_ENABLED === 'false') {
    return;
  }

  const lk = process.env.NEW_RELIC_LICENSE_KEY;
  const hasKey = Boolean(lk && String(lk).trim());

  if (!hasKey) {
    logger.warn(
      '[newrelic] NEW_RELIC_LICENSE_KEY is not set; agent not loaded. Add it to .env.local (or your host env) or set NEW_RELIC_ENABLED=false.'
    );
    return;
  }

  await import('./newrelic-agent.cjs');
}
