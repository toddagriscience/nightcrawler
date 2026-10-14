// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import { loadInferenceContactContext } from './inference-context';

const token = '2ad9a2b1-d203-4bdf-80d2-1c91c5c24124';
const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  select: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
}));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mocks.authenticate,
}));
vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: { select: mocks.select },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.limit.mockReset();
  mocks.authenticate.mockResolvedValue({ id: 7, farmId: 3 });
  mocks.select.mockReturnValue({ from: () => ({ where: mocks.where }) });
  mocks.where.mockReturnValue({ limit: mocks.limit });
  mocks.limit
    .mockResolvedValueOnce([
      {
        id: 42,
        answers: {
          questions: ['Original question', 'Follow-up'],
          managementZoneId: 12,
        },
      },
    ])
    .mockResolvedValueOnce([{ id: 12, name: 'North field' }]);
});

describe('loadInferenceContactContext', () => {
  it('loads questions only under the draft, session user/farm, token and expiry guards', async () => {
    expect(await loadInferenceContactContext(token)).toEqual({
      id: 42,
      token,
      questions: ['Original question', 'Follow-up'],
      managementZone: { id: 12, name: 'North field' },
    });
    const query = new PgDialect({ casing: 'snake_case' }).sqlToQuery(
      mocks.where.mock.calls[0][0]
    );
    expect(query.params.slice(0, 5)).toEqual([
      'iris-contact-draft',
      'generic',
      3,
      '7',
      token,
    ]);
    expect(query.params[5]).toBe(30 * 60 * 1000);
    expect(query.sql).toContain("now() - $6 * interval '1 millisecond'");
    expect(query.sql).toContain('"form_submissions"."created_at" >');
    expect(query.sql).toContain('"form_submissions"."deleted_at" is null');
    expect(
      new PgDialect().sqlToQuery(mocks.where.mock.calls[1][0]).params
    ).toEqual([12, 3]);
  });

  it('ignores invalid context identifiers without querying private data', async () => {
    expect(
      await loadInferenceContactContext('Other client question')
    ).toBeNull();
    expect(mocks.authenticate).not.toHaveBeenCalled();
    expect(mocks.select).not.toHaveBeenCalled();
  });

  it('cannot load drafts after they expired, were sent, or belong to another user/farm', async () => {
    mocks.limit.mockReset().mockResolvedValue([]);
    expect(await loadInferenceContactContext(token)).toBeNull();
    expect(mocks.select).toHaveBeenCalledTimes(1);
  });

  it('rejects a zone whose ownership changed after the draft was prepared', async () => {
    mocks.limit
      .mockReset()
      .mockResolvedValueOnce([
        {
          id: 42,
          answers: {
            questions: ['Original question'],
            managementZoneId: 99,
            managementZoneName: 'Other farm secret zone',
          },
        },
      ])
      .mockResolvedValueOnce([]);
    expect(await loadInferenceContactContext(token)).toBeNull();
  });

  it('rejects malformed stored questions', async () => {
    mocks.limit.mockReset().mockResolvedValue([
      {
        id: 42,
        answers: { questions: ['x'.repeat(1001)], managementZoneId: null },
      },
    ]);
    expect(await loadInferenceContactContext(token)).toBeNull();
  });

  it('loads a question-only draft without inventing a management zone', async () => {
    mocks.limit.mockReset().mockResolvedValue([
      {
        id: 42,
        answers: { questions: ['Question'], managementZoneId: null },
      },
    ]);
    expect(await loadInferenceContactContext(token)).toMatchObject({
      questions: ['Question'],
      managementZone: null,
    });
    expect(mocks.select).toHaveBeenCalledTimes(1);
  });

  it('does not query drafts without an authenticated account', async () => {
    mocks.authenticate.mockRejectedValue(new Error('Unauthorized'));
    await expect(loadInferenceContactContext(token)).rejects.toThrow(
      'Unauthorized'
    );
    expect(mocks.select).not.toHaveBeenCalled();
  });
});
