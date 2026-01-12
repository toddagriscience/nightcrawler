// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

const submitToGoogleSheetsMock = vi.fn();
vi.mock('@/lib/actions/googleSheets', () => ({
  submitToGoogleSheets: submitToGoogleSheetsMock,
}));

const loggerErrorMock = vi.fn();
vi.mock('@/lib/logger', () => ({
  default: {
    error: loggerErrorMock,
  },
}));

// Import AFTER mocks so action.ts uses mocked modules
import { submitPublicInquiry } from './action';

function makeFormData(fields: Record<string, string | undefined>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) fd.set(k, v);
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.CONTACT_GOOGLE_SCRIPT_URL;
});

describe('submitPublicInquiry', () => {
  it('returns success and submits to Google Sheets when inputs are valid', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';

    submitToGoogleSheetsMock.mockResolvedValueOnce(undefined);

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'Hello!',
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ error: null, data: null });
    expect(submitToGoogleSheetsMock).toHaveBeenCalledTimes(1);

    // Called with: (payloadFormData, scriptUrl)
    const [payload, url] = submitToGoogleSheetsMock.mock.calls[0];
    expect(url).toBe('https://example.com/script');
    expect(payload).toBeInstanceOf(FormData);

    // payload only includes provided fields
    expect(payload.get('name')).toBe('Inban');
    expect(payload.get('lastKnownEmail')).toBe('inban@example.com');
    expect(payload.get('response')).toBe('Hello!');
  });

  it('allows all fields to be optional (empty form still succeeds)', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';
    submitToGoogleSheetsMock.mockResolvedValueOnce(undefined);

    const fd = makeFormData({}); // no fields
    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ error: null, data: null });
    expect(submitToGoogleSheetsMock).toHaveBeenCalledTimes(1);

    const [payload] = submitToGoogleSheetsMock.mock.calls[0];
    expect(payload.get('name')).toBeNull();
    expect(payload.get('lastKnownEmail')).toBeNull();
    expect(payload.get('response')).toBeNull();
  });

  it('returns validation error if email is provided but invalid', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';

    const fd = makeFormData({
      lastKnownEmail: 'not-an-email',
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ error: 'Please enter a valid email.', data: null });
    expect(submitToGoogleSheetsMock).not.toHaveBeenCalled();
  });

  it('returns validation error if response is over 1500 chars', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';

    const fd = makeFormData({
      response: 'a'.repeat(1501),
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({
      error: 'Response is too long (max 1500 characters).',
      data: null,
    });
    expect(submitToGoogleSheetsMock).not.toHaveBeenCalled();
  });

  it('returns config error if CONTACT_GOOGLE_SCRIPT_URL is missing', async () => {
    const fd = makeFormData({ name: 'Inban' });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({
      error: 'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL',
      data: null,
    });
    expect(submitToGoogleSheetsMock).not.toHaveBeenCalled();
  });

  it('returns error when submitToGoogleSheets throws, and logs it', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';
    submitToGoogleSheetsMock.mockRejectedValueOnce(new Error('Sheets is down'));

    const fd = makeFormData({ response: 'Test' });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ error: 'Sheets is down', data: null });
    expect(loggerErrorMock).toHaveBeenCalledTimes(1);
  });
});