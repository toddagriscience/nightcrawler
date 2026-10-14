// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formSubmission } from '@nightcrawler/db/schema';
import { submitClientContact } from './actions';
import type { ContactInput } from './types';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  onboarding: vi.fn(),
  agreement: vi.fn(),
  limit: vi.fn(),
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
vi.mock('@/lib/rate-limit', () => ({ createRateLimiter: () => mocks.limit }));
vi.mock('@/lib/logger', () => ({ logger: { error: mocks.error } }));
vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: { insert: mocks.insert },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authenticate.mockResolvedValue({
    id: 7,
    farmId: 3,
    approved: true,
    role: 'Admin',
    firstName: 'Alex',
    lastName: 'Client',
    email: 'alex@example.test',
  });
  mocks.onboarding.mockResolvedValue(true);
  mocks.agreement.mockResolvedValue(true);
  mocks.limit.mockResolvedValue({ success: true });
  mocks.insert.mockReturnValue({ values: mocks.values });
  mocks.values.mockReturnValue({ returning: mocks.returning });
  mocks.returning.mockResolvedValue([{ id: 42 }]);
});

describe('submitClientContact', () => {
  it('stores a generic inbox request with trusted farm and sender identity', async () => {
    expect(
      await submitClientContact({
        subject: '  Soil question  ',
        message: '  Please review my soil results.  ',
      })
    ).toEqual({ success: true, id: 42 });
    expect(mocks.insert).toHaveBeenCalledWith(formSubmission);
    expect(mocks.onboarding).toHaveBeenCalledWith(7, true);
    expect(mocks.limit).toHaveBeenCalledWith('user:7');
    expect(mocks.values).toHaveBeenCalledWith({
      formSlug: 'iris-contact',
      workflowType: 'generic',
      status: null,
      farmId: 3,
      retentionConsent: false,
      answers: {
        subject: 'Soil question',
        message: 'Please review my soil results.',
        userId: 7,
        senderName: 'Alex Client',
        senderEmail: 'alex@example.test',
      },
    });
  });

  it('does not write when there is no authenticated farm user', async () => {
    mocks.authenticate.mockRejectedValue(new Error('User not found'));
    expect(
      await submitClientContact({ subject: 'Question', message: 'Help' })
    ).toMatchObject({
      success: false,
      message: expect.stringContaining('sign in'),
    });
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.limit).not.toHaveBeenCalled();
  });

  it('does not write before onboarding is complete', async () => {
    mocks.onboarding.mockResolvedValue(false);
    expect(
      await submitClientContact({ subject: 'Question', message: 'Help' })
    ).toMatchObject({
      success: false,
      message: expect.stringContaining('account setup'),
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('enforces the viewer agreement gate even on an approved farm', async () => {
    mocks.authenticate.mockResolvedValue({
      id: 7,
      farmId: 3,
      approved: true,
      role: 'Viewer',
      firstName: 'Alex',
      lastName: 'Client',
      email: 'alex@example.test',
    });
    mocks.agreement.mockResolvedValue(false);
    expect(
      await submitClientContact({ subject: 'Question', message: 'Help' })
    ).toMatchObject({
      success: false,
      message: expect.stringContaining('account agreement'),
    });
    expect(mocks.agreement).toHaveBeenCalledWith(7);
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('allows an onboarded viewer who has accepted the agreement to contact their advisor', async () => {
    mocks.authenticate.mockResolvedValue({
      id: 7,
      farmId: 3,
      approved: true,
      role: 'Viewer',
      firstName: 'Alex',
      lastName: 'Client',
      email: 'alex@example.test',
    });
    expect(
      await submitClientContact({ subject: 'Question', message: 'Help' })
    ).toEqual({ success: true, id: 42 });
    expect(mocks.agreement).toHaveBeenCalledWith(7);
  });

  it.each([
    { subject: ' ', message: 'Help' },
    { subject: 'Question', message: ' ' },
    { subject: 'x'.repeat(161), message: 'Help' },
    { subject: 'Question', message: 'x'.repeat(5001) },
  ])('rejects missing or oversized text', async (input) => {
    expect(await submitClientContact(input)).toMatchObject({ success: false });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('rejects attempts to supply another farm, sender or workflow', async () => {
    const input = {
      subject: 'Question',
      message: 'Help',
      farmId: 99,
      userId: 99,
      senderEmail: 'other@example.test',
      workflowType: 'platform_access',
    };
    expect(await submitClientContact(input as ContactInput)).toMatchObject({
      success: false,
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('does not write when the authenticated user exceeds the request budget', async () => {
    mocks.limit.mockResolvedValue({ success: false });
    expect(
      await submitClientContact({ subject: 'Question', message: 'Help' })
    ).toMatchObject({
      success: false,
      message: expect.stringContaining('wait a minute'),
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it.each([new Error('database details must stay private'), null])(
    'reports failed persistence without a success receipt',
    async (failure) => {
      if (failure) mocks.returning.mockRejectedValue(failure);
      else mocks.returning.mockResolvedValue([]);
      expect(
        await submitClientContact({ subject: 'Question', message: 'Help' })
      ).toEqual({
        success: false,
        message: 'Your message could not be sent. Please try again.',
      });
      expect(mocks.error).toHaveBeenCalled();
    }
  );
});
