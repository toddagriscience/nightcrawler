// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { PeerCertificate } from 'node:tls';
import { describe, expect, it } from 'vitest';
import {
  isLocalDatabaseUrl,
  normalizePemCert,
  remoteDbSslConfig,
} from './db-ssl';

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

describe('remoteDbSslConfig', () => {
  it('validates the certificate chain', () => {
    expect(remoteDbSslConfig('cert').rejectUnauthorized).toBe(true);
  });

  it('skips hostname verification, matching the verify-ca posture', () => {
    expect(
      remoteDbSslConfig('cert').checkServerIdentity?.(
        'any-host',
        {} as PeerCertificate
      )
    ).toBe(undefined);
  });

  it('normalizes the certificate it is given', () => {
    expect(remoteDbSslConfig('"line-one\\nline-two"').ca).toBe(
      'line-one\nline-two'
    );
  });

  it('omits ca entirely when no certificate is configured', () => {
    const config = remoteDbSslConfig(undefined);
    expect('ca' in config).toBe(false);
    expect(config.rejectUnauthorized).toBe(true);
  });
});
