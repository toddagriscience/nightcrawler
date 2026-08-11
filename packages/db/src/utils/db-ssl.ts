// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Single source of truth for the TLS posture of every Postgres connection this
 * package opens — the app pool, the drizzle-kit configs, and the importer
 * scripts. Keeping it in one place is what stops a `rejectUnauthorized: false`
 * from creeping back into one caller while the others are hardened.
 */

import type { ConnectionOptions } from 'node:tls';

/**
 * Hostnames that mean "the Docker Postgres from `bun run db:local:up`".
 * `URL.hostname` keeps the brackets on IPv6 literals, hence both spellings.
 */
const LOCAL_DB_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/**
 * Normalizes a PEM certificate that may arrive quote-wrapped and/or with
 * escaped newlines (both storage formats exist across our GitHub secrets and
 * .env files — see the equivalent sed in pr-database-compatibility-check.yml).
 *
 * @param raw - Certificate exactly as read from an env var
 */
export function normalizePemCert(raw: string): string {
  return raw
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '');
}

/**
 * Reports whether a connection string points at a database on this machine.
 * The local Docker instance speaks plaintext, so it must be handed `ssl: false`
 * rather than a TLS config it cannot satisfy.
 *
 * Absent, unparseable, or host-less URLs count as remote, so the caller demands
 * verification. That is deliberate: an unrecognized string must never be the
 * reason TLS gets dropped. Concretely, a password carrying a raw `#` or `/`
 * defeats `URL` parsing and surfaces as a TLS error instead of a silent
 * downgrade — percent-encode it, the way `create-admin-farm-user` already does.
 *
 * @param connectionString - Postgres URL, typically `process.env.DATABASE_URL`
 */
export function isLocalDatabaseUrl(
  connectionString: string | undefined
): boolean {
  if (!connectionString) {
    return false;
  }

  try {
    return LOCAL_DB_HOSTNAMES.has(new URL(connectionString).hostname);
  } catch {
    return false;
  }
}

/**
 * TLS options for a managed (staging/prod) cluster: validate the certificate
 * chain against our CA, but skip hostname verification. That is the psql
 * `verify-ca` posture both database workflows already use for `pg_dump`, and
 * it is deliberate — the cluster serves certificates whose subject does not
 * match the host we dial.
 *
 * Never downgrade this to `rejectUnauthorized: false`. That skips the chain as
 * well as the hostname, which leaves the connection open to a machine-in-the-
 * middle presenting any certificate at all.
 *
 * When no CA is configured the `ca` key is omitted rather than set to an empty
 * string, so Node falls back to its trust store and fails loudly at connect
 * time instead of silently trusting nothing.
 *
 * @param rawCert - CA certificate as read from an env var, if one is set
 */
export function remoteDbSslConfig(
  rawCert: string | undefined
): ConnectionOptions {
  return {
    ...(rawCert ? { ca: normalizePemCert(rawCert) } : {}),
    rejectUnauthorized: true,
    checkServerIdentity: () => undefined,
  };
}
