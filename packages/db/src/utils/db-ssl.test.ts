// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  caCertForConnection,
  formatDbHostForUrl,
  isLocalDatabaseUrl,
  isLoopbackDbHost,
  normalizePemCert,
  remoteDbSslConfig,
  resolveDbPoolConfig,
  stagingCaCert,
  stripSslQueryParams,
} from './db-ssl';

/** Env vars these helpers read, snapshotted so each test starts from a clean slate. */
const MANAGED_ENV_VARS = [
  'DATABASE_PEM_CERT',
  'STAGING_DATABASE_PEM_CERT',
  'STAGING_DATABASE_HOST',
  'DATABASE_PLAINTEXT_HOSTS',
] as const;

/** Stand-in for a managed cluster URL, composed with query params per test. */
const REMOTE_URL = 'postgresql://u:p@db.example.com:25060/main';

let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  savedEnv = Object.fromEntries(
    MANAGED_ENV_VARS.map((name) => [name, process.env[name]])
  );
  for (const name of MANAGED_ENV_VARS) {
    delete process.env[name];
  }
});

afterEach(() => {
  for (const name of MANAGED_ENV_VARS) {
    if (savedEnv[name] === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = savedEnv[name];
    }
  }
});

describe('normalizePemCert', () => {
  it('strips the wrapping quotes that .env storage adds', () => {
    expect(normalizePemCert('"-----BEGIN CERTIFICATE-----"')).toBe(
      '-----BEGIN CERTIFICATE-----'
    );
  });

  it('turns escaped newlines into real ones', () => {
    expect(normalizePemCert('line-one\\nline-two')).toBe('line-one\nline-two');
  });

  it('drops carriage returns', () => {
    expect(normalizePemCert('line-one\r\nline-two')).toBe('line-one\nline-two');
  });

  it('leaves an already-clean certificate untouched', () => {
    const clean =
      '-----BEGIN CERTIFICATE-----\nMIIE\n-----END CERTIFICATE-----';
    expect(normalizePemCert(clean)).toBe(clean);
  });
});

describe('isLocalDatabaseUrl', () => {
  it('recognizes the local Docker instance', () => {
    expect(
      isLocalDatabaseUrl(
        'postgresql://postgres:Test123!@localhost:5432/postgres'
      )
    ).toBe(true);
    expect(
      isLocalDatabaseUrl(
        'postgresql://postgres:Test123!@127.0.0.1:5433/postgres'
      )
    ).toBe(true);
    expect(
      isLocalDatabaseUrl('postgresql://postgres@[::1]:5432/postgres')
    ).toBe(true);
  });

  it('ignores hostname casing', () => {
    // `URL` does not lowercase the host of a postgresql: URL the way it does
    // for http/https, so the comparison has to.
    expect(
      isLocalDatabaseUrl(
        'postgresql://postgres:Test123!@LOCALHOST:5432/postgres'
      )
    ).toBe(true);
    expect(
      isLocalDatabaseUrl('postgresql://postgres@LocalHost:5432/postgres')
    ).toBe(true);
  });

  it('recognizes the aliases that still mean this machine', () => {
    expect(
      isLocalDatabaseUrl('postgresql://postgres@host.docker.internal:5432/db')
    ).toBe(true);
    expect(isLocalDatabaseUrl('postgresql://postgres@0.0.0.0:5432/db')).toBe(
      true
    );
  });

  it('honors hosts declared in DATABASE_PLAINTEXT_HOSTS', () => {
    expect(isLocalDatabaseUrl('postgresql://postgres@db:5432/postgres')).toBe(
      false
    );

    process.env.DATABASE_PLAINTEXT_HOSTS = 'db, 192.168.1.50';
    expect(isLocalDatabaseUrl('postgresql://postgres@db:5432/postgres')).toBe(
      true
    );
    expect(
      isLocalDatabaseUrl('postgresql://postgres@192.168.1.50:5432/postgres')
    ).toBe(true);
    // Everything not named stays remote and keeps its TLS.
    expect(
      isLocalDatabaseUrl(
        'postgresql://doadmin:secret@db-postgresql-nyc3.ondigitalocean.com:25060/main'
      )
    ).toBe(false);
  });

  it('treats a managed cluster as remote', () => {
    expect(
      isLocalDatabaseUrl(
        'postgresql://doadmin:secret@db-postgresql-nyc3.ondigitalocean.com:25060/main'
      )
    ).toBe(false);
  });

  it('fails closed on a missing or unparseable URL', () => {
    expect(isLocalDatabaseUrl(undefined)).toBe(false);
    expect(isLocalDatabaseUrl('')).toBe(false);
    expect(isLocalDatabaseUrl('not a url')).toBe(false);
  });

  it('fails closed on passwords that defeat URL parsing', () => {
    // A raw `#` or `/` in the password truncates or breaks the URL, so the
    // host cannot be trusted — demand TLS rather than guess.
    expect(isLocalDatabaseUrl('postgresql://postgres:p#ss@localhost/db')).toBe(
      false
    );
    expect(isLocalDatabaseUrl('postgresql://postgres:p/ss@localhost/db')).toBe(
      false
    );
    // Percent-encoded, the same password resolves normally.
    expect(
      isLocalDatabaseUrl('postgresql://postgres:p%23ss@localhost/db')
    ).toBe(true);
  });

  it('fails closed on a host-less (unix socket) URL', () => {
    expect(
      isLocalDatabaseUrl('postgresql:///db?host=/var/run/postgresql')
    ).toBe(false);
  });
});

describe('isLoopbackDbHost', () => {
  it('accepts the loopback spellings, bracketed or not', () => {
    expect(isLoopbackDbHost('localhost')).toBe(true);
    expect(isLoopbackDbHost('LOCALHOST')).toBe(true);
    expect(isLoopbackDbHost('127.0.0.1')).toBe(true);
    expect(isLoopbackDbHost('::1')).toBe(true);
    expect(isLoopbackDbHost('[::1]')).toBe(true);
  });

  it('stays loopback-only, whatever DATABASE_PLAINTEXT_HOSTS says', () => {
    // The importer guard is built on this: widening it by env var would let an
    // importer rebuild tables on a shared database.
    process.env.DATABASE_PLAINTEXT_HOSTS = 'db,host.docker.internal';
    expect(isLoopbackDbHost('db')).toBe(false);
    expect(isLoopbackDbHost('host.docker.internal')).toBe(false);
  });

  it('rejects a missing host', () => {
    expect(isLoopbackDbHost(undefined)).toBe(false);
    expect(isLoopbackDbHost('')).toBe(false);
  });
});

describe('formatDbHostForUrl', () => {
  it('brackets a bare IPv6 literal so the URL parses', () => {
    const url = `postgresql://u:p@${formatDbHostForUrl('::1')}:5432/postgres`;
    expect(url).toBe('postgresql://u:p@[::1]:5432/postgres');
    expect(isLocalDatabaseUrl(url)).toBe(true);
  });

  it('leaves an already-bracketed literal and plain hosts alone', () => {
    expect(formatDbHostForUrl('[::1]')).toBe('[::1]');
    expect(formatDbHostForUrl('localhost')).toBe('localhost');
    expect(formatDbHostForUrl('127.0.0.1')).toBe('127.0.0.1');
  });
});

describe('stripSslQueryParams', () => {
  it('removes the params pg would let override the explicit ssl config', () => {
    for (const param of [
      'sslmode=no-verify',
      'sslmode=require',
      'sslmode=disable',
      'ssl=true',
      'sslrootcert=/tmp/ca.pem',
    ]) {
      const stripped = stripSslQueryParams(`${REMOTE_URL}?${param}`);
      expect(stripped).not.toContain(param.split('=')[0]);
    }
  });

  it('keeps every other query parameter', () => {
    expect(
      stripSslQueryParams(`${REMOTE_URL}?sslmode=require&application_name=site`)
    ).toBe(`${REMOTE_URL}?application_name=site`);
  });

  it('returns URLs without SSL params byte-for-byte unchanged', () => {
    const url = 'postgresql://u:p%23ss@db.example.com:25060/main';
    expect(stripSslQueryParams(url)).toBe(url);
  });

  it('passes through absent and unparseable strings', () => {
    expect(stripSslQueryParams(undefined)).toBe(undefined);
    expect(stripSslQueryParams('not a url')).toBe('not a url');
  });
});

describe('stagingCaCert', () => {
  it('prefers the staging certificate', () => {
    process.env.STAGING_DATABASE_PEM_CERT = 'staging-cert';
    process.env.DATABASE_PEM_CERT = 'shared-cert';
    expect(stagingCaCert()).toBe('staging-cert');
  });

  it('falls back to the shared certificate when staging has none', () => {
    process.env.DATABASE_PEM_CERT = 'shared-cert';
    expect(stagingCaCert()).toBe('shared-cert');
  });

  it('falls back when the staging variable is present but empty', () => {
    // A bare `STAGING_DATABASE_PEM_CERT=` line parses to '', which is not
    // nullish — `??` would pin it and skip a perfectly good shared cert.
    process.env.STAGING_DATABASE_PEM_CERT = '';
    process.env.DATABASE_PEM_CERT = 'shared-cert';
    expect(stagingCaCert()).toBe('shared-cert');
  });
});

describe('caCertForConnection', () => {
  it('uses the staging certificate when the URL names the staging host', () => {
    process.env.STAGING_DATABASE_HOST = 'staging-db.example.com';
    process.env.STAGING_DATABASE_PEM_CERT = 'staging-cert';
    process.env.DATABASE_PEM_CERT = 'shared-cert';
    expect(
      caCertForConnection('postgresql://u:p@staging-db.example.com:25060/main')
    ).toBe('staging-cert');
  });

  it('uses the shared certificate for every other host', () => {
    process.env.STAGING_DATABASE_HOST = 'staging-db.example.com';
    process.env.STAGING_DATABASE_PEM_CERT = 'staging-cert';
    process.env.DATABASE_PEM_CERT = 'shared-cert';
    expect(
      caCertForConnection('postgresql://u:p@prod-db.example.com:25060/main')
    ).toBe('shared-cert');
  });

  it('returns undefined when nothing is configured', () => {
    expect(
      caCertForConnection('postgresql://u:p@prod-db.example.com:25060/main')
    ).toBe(undefined);
  });
});

describe('remoteDbSslConfig', () => {
  it('validates the certificate chain', () => {
    expect(remoteDbSslConfig('cert').rejectUnauthorized).toBe(true);
  });

  it('leaves hostname verification to Node, matching verify-full', () => {
    // Asserted as absence of the key rather than by calling it: a
    // `checkServerIdentity` that returns undefined silently accepts any
    // certificate chaining to our CA no matter which host served it, and
    // `config.checkServerIdentity?.(...)` would evaluate to undefined either
    // way, so calling it could not tell the two apart.
    expect('checkServerIdentity' in remoteDbSslConfig('cert')).toBe(false);
    expect(remoteDbSslConfig('cert').checkServerIdentity).toBe(undefined);
  });

  it('normalizes the certificate it is given', () => {
    expect(remoteDbSslConfig('"line-one\\nline-two"').ca).toBe(
      'line-one\nline-two'
    );
  });

  it('throws by name when no certificate is configured', () => {
    // Falling back to Node's public trust store would accept any publicly
    // issued certificate, which is precisely what an interceptor can get.
    expect(() => remoteDbSslConfig(undefined)).toThrow(/DATABASE_PEM_CERT/);
    expect(() => remoteDbSslConfig('')).toThrow(/DATABASE_PEM_CERT/);
    expect(() => remoteDbSslConfig('   ')).toThrow(/DATABASE_PEM_CERT/);
  });

  it('names the variable the caller actually reads', () => {
    expect(() =>
      remoteDbSslConfig(undefined, 'STAGING_DATABASE_PEM_CERT')
    ).toThrow(/STAGING_DATABASE_PEM_CERT/);
  });
});

describe('resolveDbPoolConfig', () => {
  it('gives a local database plaintext and no TLS config', () => {
    expect(
      resolveDbPoolConfig(
        'postgresql://postgres:Test123!@localhost:5432/postgres'
      )
    ).toEqual({
      connectionString:
        'postgresql://postgres:Test123!@localhost:5432/postgres',
      ssl: false,
    });
  });

  it('strips sslmode so it cannot override the hardened config', () => {
    // pg merges the parsed connection string over the explicit config, so an
    // `sslmode` left in the URL would replace ca/rejectUnauthorized wholesale.
    process.env.DATABASE_PEM_CERT = 'cert';
    const config = resolveDbPoolConfig(`${REMOTE_URL}?sslmode=no-verify`);
    expect(config.connectionString).not.toContain('sslmode');
    expect(config.ssl).toEqual({ ca: 'cert', rejectUnauthorized: true });
  });

  it('refuses a remote database with no certificate under requireCaCert', () => {
    expect(() =>
      resolveDbPoolConfig(REMOTE_URL, { requireCaCert: true })
    ).toThrow(/DATABASE_PEM_CERT/);
  });

  it('defers a missing certificate to connect time by default', () => {
    // The app pool resolves on import — during `next build` and in tests that
    // never connect — so this must not throw. Verification stays fully on, so
    // the private-CA cluster fails at connect instead.
    expect(resolveDbPoolConfig(REMOTE_URL)).toEqual({
      connectionString: REMOTE_URL,
      ssl: { rejectUnauthorized: true },
    });
    expect(resolveDbPoolConfig(undefined).ssl).toEqual({
      rejectUnauthorized: true,
    });
  });

  it('never disables hostname verification on the deferred path either', () => {
    const { ssl } = resolveDbPoolConfig(REMOTE_URL);
    expect(ssl).not.toBe(false);
    expect('checkServerIdentity' in (ssl as object)).toBe(false);
  });
});
