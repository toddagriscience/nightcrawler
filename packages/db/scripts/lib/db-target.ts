// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Resolves which database a script talks to: the local Docker instance
 * (default, unchanged behavior) or staging/prod via an explicit `--env` flag.
 * Remote writes are gated behind `--confirm <env>` so nobody points a
 * table-rebuilding importer at production by accident.
 */

import type { PoolConfig } from 'pg';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { getArg, requireLocalDatabaseUrl } from './importer-lib';

export type DbEnv = 'local' | 'staging' | 'prod';
export type RemoteDbEnv = Exclude<DbEnv, 'local'>;

/**
 * Normalizes a PEM certificate that may arrive quote-wrapped and/or with
 * escaped newlines (both storage formats exist across our GitHub secrets and
 * .env files — see the equivalent sed in pr-database-compatibility-check.yml).
 */
export function normalizePemCert(raw: string): string {
  return raw
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '');
}

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set — required to connect to this DB.`);
  }
  return value;
}

/**
 * Builds a node-postgres PoolConfig for staging or prod from the
 * STAGING_DATABASE_* / PROD_DATABASE_* env vars.
 *
 * TLS validates the CA chain but skips hostname verification (the psql
 * `verify-ca` posture both DB workflows already use for pg_dump); never
 * downgrade to `rejectUnauthorized: false`, which would skip the chain too.
 */
export function resolveRemoteDbConfig(env: RemoteDbEnv): PoolConfig {
  const prefix = env === 'prod' ? 'PROD_DATABASE' : 'STAGING_DATABASE';
  const caRaw =
    env === 'staging'
      ? (process.env.STAGING_DATABASE_PEM_CERT ??
        requireEnvVar('DATABASE_PEM_CERT'))
      : requireEnvVar('DATABASE_PEM_CERT');
  return {
    host: requireEnvVar(`${prefix}_HOST`),
    port: Number(requireEnvVar(`${prefix}_PORT`)),
    user: requireEnvVar(`${prefix}_USER`),
    password: requireEnvVar(`${prefix}_PASSWORD`),
    database: requireEnvVar(`${prefix}_DATABASE`),
    ssl: {
      ca: normalizePemCert(caRaw),
      rejectUnauthorized: true,
      checkServerIdentity: () => undefined,
    },
  };
}

export interface ImporterTarget {
  env: DbEnv;
  connection: string | PoolConfig;
}

/**
 * Resolves the importer's target DB from CLI flags:
 *   (no flag) / --env local   -> local Docker DB (localhost guard, as before)
 *   --env staging|prod        -> remote; dry runs need nothing further, but
 *                                --commit additionally requires:
 *                                  --confirm <same env>  (typed-name guard)
 *                                  OPENAI_EMBEDDINGS_KEY (placeholder
 *                                  embeddings must never reach a shared DB)
 */
export function resolveImporterTarget(): ImporterTarget {
  const env = (getArg('env') ?? 'local') as DbEnv;
  if (!['local', 'staging', 'prod'].includes(env)) {
    throw new Error(`Unknown --env "${env}" — expected local, staging, prod.`);
  }
  if (env === 'local') {
    return { env, connection: requireLocalDatabaseUrl() };
  }

  if (process.argv.includes('--commit')) {
    const confirm = getArg('confirm');
    if (confirm !== env) {
      throw new Error(
        `Refusing --commit against ${env}: pass --confirm ${env} to prove ` +
          `the target is intentional (got "${confirm ?? ''}").`
      );
    }
    if (!process.env.OPENAI_EMBEDDINGS_KEY) {
      throw new Error(
        `Refusing --commit against ${env} without OPENAI_EMBEDDINGS_KEY: ` +
          'placeholder embeddings would poison semantic search for everyone.'
      );
    }
  }
  return { env, connection: resolveRemoteDbConfig(env) };
}

/** Opens a drizzle handle for a resolved importer target. */
export function createTargetDb(target: ImporterTarget) {
  return typeof target.connection === 'string'
    ? drizzle(target.connection, { casing: 'snake_case' })
    : drizzle(new Pool(target.connection), { casing: 'snake_case' });
}
