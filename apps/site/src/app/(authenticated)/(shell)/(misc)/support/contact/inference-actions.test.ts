// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import { prepareInferenceContact } from './inference-actions';
import type { InferenceContactInput } from './types';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  onboarding: vi.fn(),
  agreement: vi.fn(),
  limitRate: vi.fn(),
  select: vi.fn(),
  zoneWhere: vi.fn(),
  zoneLimit: vi.fn(),
  removeDrafts: vi.fn(),
  removeDraftsWhere: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  returning: vi.fn(),
  error: vi.fn(),
}));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mocks.authenticate,
}));
vi.mock('@/lib/utils/platform-onboarding', () => ({
  hasCompletedPlatformOnboarding: mocks.onboarding,
}));
vi.mock('@/lib/utils/account-agreement', () => ({
  hasAcceptedAccountAgreement: mocks.agreement,
}));
vi.mock('@/lib/rate-limit', () => ({
  createRateLimiter: () => mocks.limitRate,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: mocks.error } }));
vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    select: mocks.select,
    delete: mocks.removeDrafts,
    insert: mocks.insert,
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authenticate.mockResolvedValue({
    id: 7,
    farmId: 3,
    role: 'Admin',
    approved: true,
  });
  mocks.onboarding.mockResolvedValue(true);
  mocks.agreement.mockResolvedValue(true);
  mocks.limitRate.mockResolvedValue({ success: true });
  mocks.select.mockReturnValue({ from: () => ({ where: mocks.zoneWhere }) });
  mocks.zoneWhere.mockReturnValue({ limit: mocks.zoneLimit });
  mocks.zoneLimit.mockResolvedValue([{ name: 'North field' }]);
  mocks.removeDrafts.mockReturnValue({ where: mocks.removeDraftsWhere });
  mocks.removeDraftsWhere.mockResolvedValue([]);
  mocks.insert.mockReturnValue({ values: mocks.values });
  mocks.values.mockReturnValue({ returning: mocks.returning });
  mocks.returning.mockResolvedValue([{ id: 42 }]);
});

describe('prepareInferenceContact', () => {
  it('stores trimmed questions with the session author and an owned zone, without question text in the URL', async () => {
    const result = await prepareInferenceContact({
      questions: ['  Why are my tomatoes yellow?  ', 'What should I change?'],
      managementZoneId: 12,
    });
    expect(result).toMatchObject({ success: true });
    if (!result.success) throw new Error('Expected a saved draft.');
    const token = new URL(result.url, 'http://localhost').searchParams.get(
      'context'
    );
    expect(token).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.url).toBe(`/support/contact?context=${token}`);
    expect(mocks.values).toHaveBeenCalledWith({
      formSlug: 'iris-contact-draft',
      workflowType: 'generic',
      status: null,
      farmId: 3,
      retentionConsent: false,
      answers: {
        userId: 7,
        contextToken: token,
        questions: ['Why are my tomatoes yellow?', 'What should I change?'],
        managementZoneId: 12,
        managementZoneName: 'North field',
      },
    });
    const ownership = new PgDialect().sqlToQuery(
      mocks.zoneWhere.mock.calls[0][0]
    );
    expect(ownership.params).toEqual([12, 3]);
    expect(mocks.limitRate).toHaveBeenCalledWith('user:7');
    const cleanup = new PgDialect({ casing: 'snake_case' }).sqlToQuery(
      mocks.removeDraftsWhere.mock.calls[0][0]
    );
    expect(cleanup.params.slice(0, 4)).toEqual([
      'iris-contact-draft',
      'generic',
      3,
      '7',
    ]);
    expect(cleanup.params[4]).toBe(30 * 60 * 1000);
    expect(cleanup.sql).toContain("now() - $5 * interval '1 millisecond'");
    expect(cleanup.sql).toContain('"form_submissions"."created_at" <');
  });

  it('supports a global search with no management zone', async () => {
    expect(
      await prepareInferenceContact({ questions: ['Question'] })
    ).toMatchObject({ success: true });
    expect(mocks.select).not.toHaveBeenCalled();
    expect(mocks.values.mock.calls[0][0].answers).toMatchObject({
      managementZoneId: null,
      managementZoneName: null,
    });
  });

  it('rejects a zone from another farm before storing any context', async () => {
    mocks.zoneLimit.mockResolvedValue([]);
    expect(
      await prepareInferenceContact({
        questions: ['Question'],
        managementZoneId: 99,
      })
    ).toMatchObject({
      success: false,
      message: expect.stringContaining('no longer available'),
    });
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.removeDrafts).not.toHaveBeenCalled();
  });

  it('does not persist without authentication', async () => {
    mocks.authenticate.mockRejectedValue(new Error('Unauthorized'));
    expect(
      await prepareInferenceContact({ questions: ['Question'] })
    ).toMatchObject({ success: false });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it.each(['onboarding', 'viewer agreement'])(
    'enforces %s before storing a draft',
    async (gate) => {
      if (gate === 'onboarding') mocks.onboarding.mockResolvedValue(false);
      else {
        mocks.authenticate.mockResolvedValue({
          id: 7,
          farmId: 3,
          role: 'Viewer',
          approved: true,
        });
        mocks.agreement.mockResolvedValue(false);
      }
      expect(
        await prepareInferenceContact({ questions: ['Question'] })
      ).toMatchObject({ success: false });
      expect(mocks.insert).not.toHaveBeenCalled();
      expect(mocks.removeDrafts).not.toHaveBeenCalled();
    }
  );

  it.each([
    { questions: [] },
    { questions: [' '] },
    { questions: ['x'.repeat(1001)] },
    { questions: Array(11).fill('Question') },
    { questions: Array(5).fill('x'.repeat(1000)) },
    { questions: ['Question'], managementZoneId: -1 },
    { questions: ['Question'], farmId: 99 },
  ])('rejects unbounded, invalid or forged payloads', async (input) => {
    expect(
      await prepareInferenceContact(input as InferenceContactInput)
    ).toMatchObject({ success: false });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('does not store a draft when the handoff rate limit is exceeded', async () => {
    mocks.limitRate.mockResolvedValue({ success: false });
    expect(
      await prepareInferenceContact({ questions: ['Question'] })
    ).toMatchObject({
      success: false,
      message: expect.stringContaining('wait a minute'),
    });
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.removeDrafts).not.toHaveBeenCalled();
  });

  it.each([new Error('private database error'), null])(
    'returns no handoff URL after a failed insert',
    async (failure) => {
      if (failure) mocks.returning.mockRejectedValue(failure);
      else mocks.returning.mockResolvedValue([]);
      expect(
        await prepareInferenceContact({ questions: ['Question'] })
      ).toEqual({
        success: false,
        message: 'Your questions could not be transferred. Please try again.',
      });
      expect(mocks.error).toHaveBeenCalled();
    }
  );
});
