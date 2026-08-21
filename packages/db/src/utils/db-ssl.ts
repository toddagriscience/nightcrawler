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
 * Loopback spellings, stored unbracketed — `normalizeDbHost` strips the
 * brackets `URL.hostname` keeps on an IPv6 literal, so `[::1]` and a raw
 * `LOCAL_DATABASE_HOST=::1` both land on the same entry.
 *
 * This is the strict set: the importer guard refuses anything outside it, no
 * matter what `DATABASE_PLAINTEXT_HOSTS` says.
 */
const LOOPBACK_DB_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

/**
 * Hostnames that also mean "a database on this machine": `0.0.0.0` resolves to
 * loopback when dialed, and `host.docker.internal` is the alias Docker hands a
 * container for its host. Both address the local plaintext Postgres, so both
 * must skip TLS the way loopback does.
 */
const LOCAL_DB_HOSTNAMES = new Set([
  ...LOOPBACK_DB_HOSTNAMES,
  '0.0.0.0',
  'host.docker.internal',
]);

/**
 * libpq query parameters that `pg-connection-string` turns into an `ssl`
 * object. pg merges the parsed connection string *over* the explicit config
 * (`Object.assign({}, config, parse(connectionString))`), so any one of these
 * in a URL silently replaces the hardened config below — `sslmode=no-verify`
 * would restore the unverified connection this module exists to prevent, and
 * `sslmode=require` (what the DigitalOcean dashboard hands you) would drop the
 * CA and fail every query. They are stripped before the URL reaches pg.
 */
const SSL_QUERY_PARAMS = new Set([
  'ssl',
  'sslmode',
  'sslcert',
  'sslkey',
  'sslrootcert',
  'uselibpqcompat',
]);

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
 * Canonicalizes a hostname for comparison: lowercased, brackets stripped.
 *
 * Both steps matter. `URL` does not lowercase the host of a `postgresql:` URL
 * the way it does for http/https (the scheme is not "special"), so a developer
 * who wrote `@LOCALHOST:5432` would otherwise be classified as remote; and
 * `URL.hostname` returns IPv6 literals bracketed while an env var holds them
 * bare.
 *
 * @param host - Hostname from a URL or an env var
 */
function normalizeDbHost(host: string): string {
  return host.trim().toLowerCase().replace(/^\[/, '').replace(/\]$/, '');
}

/**
 * Extra hostnames a developer has declared to be a local, plaintext database —
 * a docker-compose service name, a LAN address, whatever their setup dials.
 *
 * This is the narrow replacement for `NODE_TLS_REJECT_UNAUTHORIZED=0`: that
 * switch disabled certificate verification for every TLS connection in the
 * process (Supabase and every other HTTPS call included) and for every host,
 * so setting it to reach a local database also silently unverified staging and
 * production. This one only ever names hosts, so it cannot downgrade a cluster
 * unless someone types that cluster's hostname into it.
 *
 * Read per call rather than at module load so `dotenv/config` ordering and
 * per-test overrides both take effect.
 */
function declaredPlaintextHosts(): Set<string> {
  const raw = process.env.DATABASE_PLAINTEXT_HOSTS ?? '';
  return new Set(
    raw
      .split(',')
      .map((host) => normalizeDbHost(host))
      .filter(Boolean)
  );
}

/**
 * Reports whether a bare hostname is a loopback address.
 *
 * Deliberately ignores `DATABASE_PLAINTEXT_HOSTS`: this backs the importer
 * guard, whose job is to refuse a shared database outright, and an env var that
 * could widen it would defeat the guard.
 *
 * @param host - Hostname, e.g. `process.env.LOCAL_DATABASE_HOST`
 */
export function isLoopbackDbHost(host: string | undefined): boolean {
  return Boolean(host) && LOOPBACK_DB_HOSTNAMES.has(normalizeDbHost(host!));
}

/**
 * Formats a hostname for interpolation into a connection URL, bracketing IPv6
 * literals. Without this, `LOCAL_DATABASE_HOST=::1` builds
 * `postgresql://u:p@::1:5432/db`, which is not a parseable URL at all — every
 * consumer that reads it back, `isLocalDatabaseUrl` included, fails closed and
 * demands TLS from the plaintext local database.
 *
 * @param host - Hostname to place in a URL's authority section
 */
export function formatDbHostForUrl(host: string): string {
  const trimmed = host.trim();
  const needsBrackets = trimmed.includes(':') && !trimmed.startsWith('[');
  return needsBrackets ? `[${trimmed}]` : trimmed;
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

  let hostname: string;
  try {
    hostname = new URL(connectionString).hostname;
  } catch {
    return false;
  }

  if (!hostname) {
    return false;
  }

  const host = normalizeDbHost(hostname);
  return LOCAL_DB_HOSTNAMES.has(host) || declaredPlaintextHosts().has(host);
}

/**
 * Removes the libpq SSL query parameters from a connection URL so the explicit
 * TLS config the caller passes to pg is the one that actually applies. See
 * `SSL_QUERY_PARAMS` for why pg would otherwise discard it.
 *
 * Stripping rather than rejecting is deliberate: `?sslmode=require` is what the
 * DigitalOcean dashboard puts on the URL it gives you, and the posture it asks
 * for is weaker than the one we substitute, so there is nothing to warn about.
 *
 * @param connectionString - Postgres URL, or undefined
 * @returns The URL without SSL parameters, unchanged if it carried none
 */
export function stripSslQueryParams(
  connectionString: string | undefined
): string | undefined {
  if (!connectionString) {
    return connectionString;
  }

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    // Unparseable strings are handed through untouched; `isLocalDatabaseUrl`
    // already fails them closed, so they get the verified config either way.
    return connectionString;
  }

  const params = [...url.searchParams.entries()];
  const kept = params.filter(
    ([param]) => !SSL_QUERY_PARAMS.has(param.toLowerCase())
  );

  if (kept.length === params.length) {
    return connectionString;
  }

  url.search = new URLSearchParams(kept).toString();
  return url.toString();
}

/**
 * The CA certificate for the staging cluster, falling back to the shared one —
 * CI historically only sets `DATABASE_PEM_CERT`.
 *
 * `||` rather than `??` on purpose: a `STAGING_DATABASE_PEM_CERT=` line with no
 * value parses to an empty string, which is not nullish, so `??` would pin the
 * empty string and skip a perfectly good `DATABASE_PEM_CERT`.
 */
export function stagingCaCert(): string | undefined {
  return process.env.STAGING_DATABASE_PEM_CERT || process.env.DATABASE_PEM_CERT;
}

/**
 * The CA certificate to verify a given host against: the staging cluster has
 * its own, everything else uses the shared one. Host-matched rather than
 * caller-declared so a script pointed at staging by `DATABASE_URL` picks up
 * `STAGING_DATABASE_PEM_CERT` without every caller having to know.
 *
 * @param connectionString - Postgres URL the certificate must verify
 */
export function caCertForConnection(
  connectionString: string | undefined
): string | undefined {
  return caCertSourceForConnection(connectionString).cert;
}

/**
 * The certificate for a connection *and* the env var that supplied it.
 *
 * Split out so a missing certificate is reported against the variable the
 * lookup actually consulted. `resolveDbPoolConfig` previously let
 * `remoteDbSslConfig` fall back to its `DATABASE_PEM_CERT` default, which named
 * the wrong variable for a staging host — where `stagingCaCert()` reads
 * `STAGING_DATABASE_PEM_CERT` first.
 *
 * @param connectionString - Postgres URL the certificate must verify
 * @returns The certificate, if configured, and the variable to name on failure
 */
function caCertSourceForConnection(connectionString: string | undefined): {
  cert: string | undefined;
  varName: string;
} {
  const stagingHost = process.env.STAGING_DATABASE_HOST;

  if (connectionString && stagingHost) {
    try {
      const host = normalizeDbHost(new URL(connectionString).hostname);
      if (host && host === normalizeDbHost(stagingHost)) {
        return {
          cert: stagingCaCert(),
          varName: 'STAGING_DATABASE_PEM_CERT (or DATABASE_PEM_CERT)',
        };
      }
    } catch {
      // Unparseable URL — fall through to the shared certificate.
    }
  }

  return {
    cert: process.env.DATABASE_PEM_CERT || undefined,
    varName: 'DATABASE_PEM_CERT',
  };
}

/**
 * TLS options for a managed (staging/prod) cluster: prove the certificate
 * chains to our CA *and* that it was issued for the host we dialed, i.e. the
 * psql `verify-full` posture db-reconcile.yml already uses against both
 * clusters.
 *
 * Never downgrade this to `rejectUnauthorized: false`, and do not reintroduce a
 * `checkServerIdentity` that returns undefined. The first skips the chain, the
 * second skips the hostname; either leaves the connection open to a
 * machine-in-the-middle holding some other certificate.
 *
 * A missing certificate throws, so the misconfiguration arrives named rather
 * than as an opaque SELF_SIGNED_CERT_IN_CHAIN at connect time. Callers that
 * cannot throw where they are — a module-scope pool, which is imported during
 * `next build` and by unit tests that never open a connection — should go
 * through `resolveDbPoolConfig` instead of catching this.
 *
 * @param rawCert - CA certificate as read from an env var
 * @param certVarName - Variable to name in the error when it is missing
 * @throws If no certificate is configured
 */
export function remoteDbSslConfig(
  rawCert: string | undefined,
  certVarName = 'DATABASE_PEM_CERT'
): ConnectionOptions {
  const ca = rawCert ? normalizePemCert(rawCert).trim() : '';

  if (!ca) {
    throw new Error(
      `${certVarName} is not set — a managed Postgres cluster is verified ` +
        'against its CA certificate, so there is nothing to verify against. ' +
        'Set it from the provider dashboard, or point the connection at a ' +
        'local database.'
    );
  }

  return { ca, rejectUnauthorized: true };
}

/**
 * The connection string and TLS options for a pg `Pool`, resolved together so
 * no caller can sanitize the URL without hardening the socket or vice versa.
 *
 * With `requireCaCert`, a managed target with no configured certificate throws
 * immediately, naming the variable to set. Scripts want that; the app pool
 * cannot have it, because it is built when its module is imported — during
 * `next build` and in unit tests that never open a connection — and a build
 * with no database configured at all must not die on a certificate error.
 *
 * Without it, a missing certificate leaves full verification on and lets Node
 * fall back to its public trust store. That is not a hole: hostname and chain
 * are both still checked, so an interceptor would need a publicly-issued
 * certificate for the cluster's own hostname. Against our clusters, which are
 * signed by a private CA, it simply fails at connect — loudly, where a
 * connection is actually being opened.
 *
 * @param connectionString - Postgres URL, typically `process.env.DATABASE_URL`
 * @param options - `requireCaCert` to fail here rather than at connect time
 * @throws With `requireCaCert`, if the target is managed and no cert is set
 */
export function resolveDbPoolConfig(
  connectionString: string | undefined,
  options: { requireCaCert?: boolean } = {}
): {
  connectionString: string | undefined;
  ssl: ConnectionOptions | false;
} {
  const sanitized = stripSslQueryParams(connectionString);

  if (isLocalDatabaseUrl(sanitized)) {
    return { connectionString: sanitized, ssl: false };
  }

  const { cert: rawCert, varName } = caCertSourceForConnection(sanitized);

  return {
    connectionString: sanitized,
    ssl:
      rawCert || options.requireCaCert
        ? remoteDbSslConfig(rawCert, varName)
        : { rejectUnauthorized: true },
  };
}
