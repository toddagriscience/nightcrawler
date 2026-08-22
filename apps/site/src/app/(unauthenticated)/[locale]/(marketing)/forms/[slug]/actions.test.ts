// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getFormBySlug: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  returning: vi.fn(),
  loggerWarn: vi.fn(),
  loggerError: vi.fn(),
  enforceRateLimit: vi.fn(),
}));

vi.mock('@/lib/sanity/forms', () => ({
  getFormBySlug: mocks.getFormBySlug,
}));

vi.mock('@nightcrawler/db', () => ({
  db: { insert: mocks.insert },
}));

vi.mock('@nightcrawler/db/schema', () => ({
  formSubmission: { id: 'id' },
}));

vi.mock('@nightcrawler/db/utils/extract-applicant-prefill', () => ({
  enrichStoredAnswersWithSignupPrefill: (answers: unknown) => answers,
}));

vi.mock('@/lib/logger', () => ({
  logger: { warn: mocks.loggerWarn, error: mocks.loggerError },
  default: { warn: mocks.loggerWarn, error: mocks.loggerError },
}));

vi.mock('@/lib/rate-limit', () => ({
  enforceRateLimit: mocks.enforceRateLimit,
}));

vi.mock('./utils', () => ({
  buildFormAnswersSchema: () => ({
    safeParse: (data: unknown) => ({ success: true, data }),
  }),
  buildStoredFormAnswers: (data: Record<string, unknown>) => data,
  flattenFormFields: () => [],
  FORM_HONEYPOT_FIELD: '_hp',
  readRetentionConsentFromValues: () => false,
  resolveFormFooterCheckboxes: () => [],
  resolveFormSections: () => [],
}));

import { submitFormSubmission } from './actions';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.enforceRateLimit.mockResolvedValue(undefined);
  mocks.getFormBySlug.mockResolvedValue({ workflowType: 'generic' });

  // db.insert(...).values(...).returning(...) fluent chain
  mocks.returning.mockResolvedValue([{ id: 'row-1' }]);
  mocks.values.mockReturnValue({ returning: mocks.returning });
  mocks.insert.mockReturnValue({ values: mocks.values });
});

describe('submitFormSubmission', () => {
  it('throws and skips the db insert when rate limited', async () => {
    mocks.enforceRateLimit.mockRejectedValueOnce(
      new Error('Too many requests. Please try again shortly.')
    );

    await expect(
      submitFormSubmission({ formSlug: 'demo', answers: {} })
    ).rejects.toThrow('Too many requests. Please try again shortly.');

    expect(mocks.getFormBySlug).not.toHaveBeenCalled();
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('persists the submission when allowed', async () => {
    const result = await submitFormSubmission({
      formSlug: 'demo',
      answers: { foo: 'bar' },
    });

    expect(mocks.enforceRateLimit).toHaveBeenCalledTimes(1);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: { id: 'row-1' } });
  });
});
