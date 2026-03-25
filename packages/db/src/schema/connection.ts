// Copyright © Todd Agriscience, Inc. All rights reserved.

// This is a separate export for server-side logic only
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

/**
 * Configures SSL settings based on NODE_TLS_REJECT_UNAUTHORIZED environment variable.
 * When NODE_TLS_REJECT_UNAUTHORIZED is '0' (development), SSL is disabled.
 * Otherwise, SSL is enabled with DATABASE_PEM_CERT if provided.
 *
 * @returns SSL configuration object or false
 */
const getSslConfig = (): false | { ca: string } => {
  // Disable SSL for development (NODE_TLS_REJECT_UNAUTHORIZED='0')
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    return false;
  }

  // Enable SSL for production with PEM certificate
  if (process.env.DATABASE_PEM_CERT) {
    return {
      ca: process.env.DATABASE_PEM_CERT,
    };
  }

  // Default to false if no certificate is provided
  return false;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: getSslConfig(),
    max: 25,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { casing: 'snake_case' });
