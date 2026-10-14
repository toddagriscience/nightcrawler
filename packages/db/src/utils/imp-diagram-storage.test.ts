// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  destroy: vi.fn(),
  config: vi.fn(),
}));
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {
    constructor(config: unknown) {
      mocks.config(config);
    }
    send = mocks.send;
    destroy = mocks.destroy;
  },
  PutObjectCommand: class {
    constructor(public input: unknown) {}
  },
  GetObjectCommand: class {
    constructor(public input: unknown) {}
  },
}));
import {
  getImpDiagram,
  impDiagramStorageConfig,
  putImpDiagram,
} from './imp-diagram-storage';
const png = new Uint8Array(24);
png.set([137, 80, 78, 71, 13, 10, 26, 10]);
png.set([73, 72, 68, 82], 12);
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('IMP_DIAGRAM_BUCKET', 'test-diagrams');
  vi.stubEnv('IMP_DIAGRAM_REGION', 'auto');
  vi.stubEnv('IMP_DIAGRAM_ACCESS_KEY_ID', 'fixture');
  vi.stubEnv('IMP_DIAGRAM_SECRET_ACCESS_KEY', 'fixture');
  vi.stubEnv('IMP_DIAGRAM_ENDPOINT', 'http://localhost:9007');
  vi.stubEnv('IMP_DIAGRAM_PREFIX', 'imp-diagrams');
});
afterEach(() => vi.unstubAllEnvs());
describe('private diagram storage boundary', () => {
  it('requires explicit credentials and disallows remote plaintext endpoints', () => {
    vi.stubEnv('IMP_DIAGRAM_SECRET_ACCESS_KEY', '');
    expect(impDiagramStorageConfig).toThrow('not configured');
    vi.stubEnv('IMP_DIAGRAM_SECRET_ACCESS_KEY', 'fixture');
    vi.stubEnv('IMP_DIAGRAM_ENDPOINT', 'http://example.test');
    expect(impDiagramStorageConfig).toThrow('HTTPS');
    expect(mocks.config).not.toHaveBeenCalled();
  });
  it('uses generated private prefix keys and byte-derived content type, never a public ACL', async () => {
    mocks.send.mockResolvedValue({});
    const name = await putImpDiagram(png);
    expect(mocks.send.mock.calls[0][0].input).toEqual({
      Bucket: 'test-diagrams',
      Key: `imp-diagrams/${name}`,
      Body: png,
      ContentType: 'image/png',
    });
    expect(mocks.destroy).toHaveBeenCalled();
  });
  it('rejects traversal before touching storage and checks downloaded size/format', async () => {
    await expect(getImpDiagram('../secret')).rejects.toThrow('Invalid');
    expect(mocks.send).not.toHaveBeenCalled();
    mocks.send.mockResolvedValue({
      ContentLength: 900000,
      Body: { transformToByteArray: vi.fn() },
    });
    await expect(
      getImpDiagram('12345678-1234-4123-8123-123456789abc.png')
    ).rejects.toThrow('size');
    mocks.send.mockResolvedValue({
      ContentLength: 24,
      Body: { transformToByteArray: () => png },
    });
    expect(
      (await getImpDiagram('12345678-1234-4123-8123-123456789abc.png'))
        .contentType
    ).toBe('image/png');
  });
});
