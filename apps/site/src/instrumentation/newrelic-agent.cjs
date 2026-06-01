// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * CommonJS shim so `instrumentation.ts` can load the New Relic agent without importing
 * `node:module` at the instrumentation entry (avoids Turbopack Edge-runtime analysis warnings).
 */

'use strict';

require('newrelic');
