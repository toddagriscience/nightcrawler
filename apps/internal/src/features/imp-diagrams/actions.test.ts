// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, expect, it, vi } from 'vitest';
import { File as NodeFile } from 'node:buffer';
const mocks = vi.hoisted(() => ({ authorize: vi.fn(), put: vi.fn() }));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('@nightcrawler/db/utils/imp-diagram-storage', () => ({
  putImpDiagram: mocks.put,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
import { uploadImpDiagram } from './actions';
beforeEach(() => {
  vi.resetAllMocks();
  mocks.authorize.mockResolvedValue({ id: 1 });
});
it('denies upload before reading bytes or writing storage', async () => {
  mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
  await expect(uploadImpDiagram(new FormData())).rejects.toThrow(
    'Unauthorized'
  );
  expect(mocks.put).not.toHaveBeenCalled();
});
it('requires an image and meaningful alt text', async () => {
  const form = new FormData();
  const file = new File(['x'], 'image.png');
  Object.defineProperty(file, 'arrayBuffer', {
    value: async () => new Uint8Array([1]).buffer,
  });
  form.set('file', file);
  form.set('alt', ' ');
  expect((await uploadImpDiagram(form)).ok).toBe(false);
  expect(mocks.put).not.toHaveBeenCalled();
});
it('returns escaped Markdown only after a successful private upload', async () => {
  const form = new FormData();
  const file = new File(['x'], 'image.png');
  Object.defineProperty(file, 'arrayBuffer', {
    value: async () => new Uint8Array([1]).buffer,
  });
  form.set('file', file);
  form.set('alt', 'Range [diagram]');
  mocks.put.mockResolvedValue('12345678-1234-4123-8123-123456789abc.png');
  const result = await uploadImpDiagram(form);
  expect(result).toEqual({
    ok: true,
    markdown:
      '![Range \\[diagram\\]](/api/imp-diagrams/12345678-1234-4123-8123-123456789abc.png)',
  });
});
it('accepts a decoded file from another runtime realm instead of relying on global instanceof', async () => {
  const file = new NodeFile(['image'], 'diagram.png');
  expect(file instanceof File).toBe(false);
  const form = new FormData();
  vi.spyOn(form, 'get').mockImplementation((key) =>
    key === 'file' ? (file as unknown as File) : 'Scale'
  );
  mocks.put.mockResolvedValue('12345678-1234-4123-8123-123456789abc.png');
  expect((await uploadImpDiagram(form)).ok).toBe(true);
});
