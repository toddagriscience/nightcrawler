// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import { getClientInquiries, markClientInquiryHandled } from './actions';

const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  select: vi.fn(),
  listWhere: vi.fn(),
  orderBy: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  updateWhere: vi.fn(),
  returning: vi.fn(),
  revalidate: vi.fn(),
  error: vi.fn(),
}));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: mocks.error } }));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }));
vi.mock('@nightcrawler/db', () => ({
  db: { select: mocks.select, update: mocks.update },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authorize.mockResolvedValue({ id: 11, email: 'staff@example.test' });
  mocks.select.mockReturnValue({
    from: () => ({ leftJoin: () => ({ where: mocks.listWhere }) }),
  });
  mocks.listWhere.mockReturnValue({ orderBy: mocks.orderBy });
  mocks.orderBy.mockResolvedValue([
    {
      id: 42,
      farmId: 3,
      farmName: 'Green Acres',
      answers: {
        subject: 'Soil results',
        message: 'Please help.',
        senderName: 'Alex Client',
        senderEmail: 'alex@example.test',
        userId: 7,
      },
      createdAt: new Date('2026-10-14T05:00:00Z'),
      reviewedAt: null,
    },
  ]);
  mocks.update.mockReturnValue({ set: mocks.set });
  mocks.set.mockReturnValue({ where: mocks.updateWhere });
  mocks.updateWhere.mockReturnValue({ returning: mocks.returning });
  mocks.returning.mockResolvedValue([{ id: 42 }]);
});

describe('getClientInquiries', () => {
  it('projects the original inference questions and zone after a client sends the draft', async () => {
    mocks.orderBy.mockResolvedValue([
      {
        id: 42,
        farmId: 3,
        farmName: 'Green Acres',
        answers: {
          subject: 'Edited subject',
          message: 'Edited message',
          source: 'inference',
          questions: ['Original question', 'Follow-up'],
          managementZoneId: 12,
          managementZoneName: 'North field',
          contextToken: 'must not reach the inbox',
          signupToken: 'must not reach the inbox',
        },
        createdAt: new Date(),
        reviewedAt: null,
      },
    ]);
    const [inquiry] = await getClientInquiries();
    expect(inquiry.inferenceContext).toEqual({
      questions: ['Original question', 'Follow-up'],
      managementZoneId: 12,
      managementZoneName: 'North field',
    });
    expect(inquiry).not.toHaveProperty('contextToken');
    expect(inquiry).not.toHaveProperty('signupToken');
    const filter = new PgDialect().sqlToQuery(mocks.listWhere.mock.calls[0][0]);
    expect(filter.params).toEqual(['iris-contact', 'generic']);
  });
  it('lists only live generic Iris requests and projects the inbox fields', async () => {
    expect(await getClientInquiries()).toEqual([
      {
        id: 42,
        farmId: 3,
        farmName: 'Green Acres',
        subject: 'Soil results',
        message: 'Please help.',
        senderName: 'Alex Client',
        senderEmail: 'alex@example.test',
        createdAt: new Date('2026-10-14T05:00:00Z'),
        reviewedAt: null,
      },
    ]);
    const query = new PgDialect({ casing: 'snake_case' }).sqlToQuery(
      mocks.listWhere.mock.calls[0][0]
    );
    expect(query.params).toEqual(['iris-contact', 'generic']);
    expect(query.sql).toContain('"form_submissions"."deleted_at" is null');
    expect(mocks.authorize).toHaveBeenCalledTimes(1);
  });
  it('never queries the inbox without an active internal account', async () => {
    mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
    await expect(getClientInquiries()).rejects.toThrow('Unauthorized');
    expect(mocks.select).not.toHaveBeenCalled();
  });
  it('does not disguise a database failure as an empty inbox', async () => {
    mocks.orderBy.mockRejectedValue(new Error('database unavailable'));
    await expect(getClientInquiries()).rejects.toThrow('database unavailable');
  });
});

describe('markClientInquiryHandled', () => {
  it('attributes review to the session staff member and confines the update to unhandled Iris requests', async () => {
    expect(await markClientInquiryHandled(42)).toEqual({ success: true });
    expect(mocks.set).toHaveBeenCalledWith({
      reviewedAt: expect.any(Date),
      reviewedByInternalAccountId: 11,
    });
    const query = new PgDialect({ casing: 'snake_case' }).sqlToQuery(
      mocks.updateWhere.mock.calls[0][0]
    );
    expect(query.params).toEqual([42, 'iris-contact', 'generic']);
    expect(query.sql).toContain('"form_submissions"."deleted_at" is null');
    expect(query.sql).toContain('"form_submissions"."reviewed_at" is null');
    expect(mocks.revalidate).toHaveBeenCalledWith('/inquiries');
  });
  it('does not update any record without active staff authorization', async () => {
    mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
    await expect(markClientInquiryHandled(42)).rejects.toThrow('Unauthorized');
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it.each([0, -1, 1.5, Number.NaN])(
    'rejects invalid request id %s',
    async (id) => {
      expect(await markClientInquiryHandled(id)).toMatchObject({
        success: false,
      });
      expect(mocks.update).not.toHaveBeenCalled();
    }
  );
  it('does not claim a different workflow, deleted or previously handled request was updated', async () => {
    mocks.returning.mockResolvedValue([]);
    expect(await markClientInquiryHandled(42)).toMatchObject({
      success: false,
      message: expect.stringContaining('already handled'),
    });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
  it('returns a useful failure when persistence fails', async () => {
    mocks.returning.mockRejectedValue(new Error('private database error'));
    expect(await markClientInquiryHandled(42)).toEqual({
      success: false,
      message: 'The request could not be updated. Please try again.',
    });
    expect(mocks.error).toHaveBeenCalled();
  });
});
