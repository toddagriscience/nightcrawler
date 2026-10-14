// Copyright © Todd Agriscience, Inc. All rights reserved.

// This is a separate export for server-side logic only
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';
import { resolveDbPoolConfig } from '../utils/db-ssl';

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

/**
 * The local Docker Postgres speaks plaintext, so it is given no TLS config at
 * all. Every other target is a managed cluster and must prove its certificate
 * chains to our CA and was issued for the host we dialed.
 *
 * `NODE_TLS_REJECT_UNAUTHORIZED` deliberately no longer switches this off: it
 * only ever existed to make the local connection work, but it applied to every
 * host, so a developer or deployment with it set was talking to staging and
 * production with verification disabled. A local database on a host the
 * loopback set does not cover is declared by name in
 * `DATABASE_PLAINTEXT_HOSTS` instead.
 *
 * Resolved without `requireCaCert` on purpose: this runs on import, including
 * during `next build` and in unit tests that mock the pool and never connect,
 * so a missing certificate must surface when a connection is opened rather
 * than take down anything that merely imports `db`.
 */
const { connectionString, ssl } = resolveDbPoolConfig(process.env.DATABASE_URL);

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl,
    max: 25,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { casing: 'snake_case' });
