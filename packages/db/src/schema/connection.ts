// Copyright © Todd Agriscience, Inc. All rights reserved.

// This is a separate export for server-side logic only
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';
import { isLocalDatabaseUrl, remoteDbSslConfig } from '../utils/db-ssl';

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

const connectionString = process.env.DATABASE_URL;

/**
 * The local Docker Postgres speaks plaintext, so it is given no TLS config at
 * all. Every other target is a managed cluster and must prove its certificate
 * chains to our CA.
 *
 * `NODE_TLS_REJECT_UNAUTHORIZED` deliberately no longer switches this off: it
 * only ever existed to make the local connection work, but it applied to every
 * host, so a developer or deployment with it set was talking to staging and
 * production with verification disabled.
 */
const ssl = isLocalDatabaseUrl(connectionString)
  ? false
  : remoteDbSslConfig(process.env.DATABASE_PEM_CERT);

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
