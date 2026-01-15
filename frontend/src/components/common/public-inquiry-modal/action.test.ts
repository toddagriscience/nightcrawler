// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

// hoisted-safe mocks
const mocks = vi.hoisted(() => ({
  submitToGoogleSheets: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock('@/lib/actions/googleSheets', () => ({
  submitToGoogleSheets: mocks.submitToGoogleSheets,
}));

vi.mock('@/lib/logger', () => ({
  default: { error: mocks.loggerError },
}));

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
    mocks.submitToGoogleSheets.mockResolvedValueOnce(undefined);

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'Hello!',
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ error: null, data: null });
    expect(mocks.submitToGoogleSheets).toHaveBeenCalledTimes(1);

    const [submittedFormData, url] = mocks.submitToGoogleSheets.mock.calls[0];
    expect(url).toBe('https://example.com/script');
    expect(submittedFormData).toBeInstanceOf(FormData);

    expect(submittedFormData.get('name')).toBe('Inban');
    expect(submittedFormData.get('lastKnownEmail')).toBe('inban@example.com');
    expect(submittedFormData.get('response')).toBe('Hello!');
  });

  it('returns an error when required fields are missing', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';

    const fd = makeFormData({});
    const result = await submitPublicInquiry(fd);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();

    // action.ts now returns z.treeifyError(...) as `error`
    expect(result.error).toHaveProperty('properties.name.errors');
    expect(result.error.properties.name.errors[0]).toBe(
      'Invalid input: expected string, received null'
    );

    expect(mocks.submitToGoogleSheets).not.toHaveBeenCalled();
  });

  it('returns validation error if email is provided but invalid', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'not-an-email',
      response: 'Hello!',
    });

    const result = await submitPublicInquiry(fd);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();

    expect(result.error).toHaveProperty('properties.lastKnownEmail.errors');
    expect(result.error.properties.lastKnownEmail.errors[0]).toBe(
      'Please enter a valid email.'
    );

    expect(mocks.submitToGoogleSheets).not.toHaveBeenCalled();
  });

  it('returns validation error if response is over 1500 chars', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'a'.repeat(1501),
    });

    const result = await submitPublicInquiry(fd);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();

    expect(result.error).toHaveProperty('properties.response.errors');
    expect(result.error.properties.response.errors[0]).toBe(
      'Response is too long (max 1500 characters).'
    );

    expect(mocks.submitToGoogleSheets).not.toHaveBeenCalled();
  });

  it('returns config error if CONTACT_GOOGLE_SCRIPT_URL is missing', async () => {
    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'Hello!',
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({
      error: 'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL',
      data: null,
    });
    expect(mocks.submitToGoogleSheets).not.toHaveBeenCalled();
  });

  it('returns error when submitToGoogleSheets throws, and logs it', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://example.com/script';
    mocks.submitToGoogleSheets.mockRejectedValueOnce(
      new Error('Sheets is down')
    );

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'Test',
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ error: 'Sheets is down', data: null });
    expect(mocks.loggerError).toHaveBeenCalledTimes(1);
  });
});
