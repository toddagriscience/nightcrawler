// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * New Relic Node agent configuration (CommonJS; use `.cjs` because this package is `"type": "module"`).
 *
 * Required in production:
 * - `NEW_RELIC_LICENSE_KEY` — New Relic ingest license key.
 * - `NEW_RELIC_APP_NAME` — Application name in New Relic (defaults to `TODD_SITE` if unset).
 *
 * Optional:
 * - `NEW_RELIC_ENABLED` — Set to `false` to disable the agent (e.g. local runs without sending data).
 *
 * Bootstrap: the agent is loaded from [`src/instrumentation/register.ts`](src/instrumentation/register.ts)
 * (re-exported by [`src/instrumentation.ts`](src/instrumentation.ts)) when `NEXT_RUNTIME === 'nodejs'`.
 * If `NEW_RELIC_ENABLED=FALSE` or `NEW_RELIC_LICENSE_KEY` is missing, the agent is not loaded
 * (avoids New Relic's hard error on empty keys during local dev).
 *
 * @see https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent/
 */

'use strict';

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'TODD_SITE'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  distributed_tracing: { enabled: true },
  logging: { level: 'info' },
  // Exclude sensitive headers in production
  attributes: {
    exclude: ['request.headers.cookie', 'request.headers.authorization'],
  },
};
