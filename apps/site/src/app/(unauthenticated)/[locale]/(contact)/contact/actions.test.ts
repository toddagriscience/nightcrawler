// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  submitContactToSheets: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock('@/lib/actions/googleSheets', () => ({
  submitContactToSheets: mocks.submitContactToSheets,
}));

vi.mock('@/lib/logger', () => ({
  default: { error: mocks.loggerError },
}));

import { submitPublicInquiry } from './actions';

/**
 * Builds form data for public inquiry action tests.
 *
 * @param fields - Field names and values to include
 * @returns Populated form data instance
 */
function makeFormData(fields: Record<string, string | undefined>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) fd.set(k, v);
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('submitPublicInquiry', () => {
  it('returns success and submits to the contact sheet when inputs are valid', async () => {
    mocks.submitContactToSheets.mockResolvedValueOnce(undefined);

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'Hello!',
    });

    const result = await submitPublicInquiry(fd);

    expect(result).toEqual({ data: null });
    expect(mocks.submitContactToSheets).toHaveBeenCalledTimes(1);

    // The action forwards only the form data — never a URL (URL is bound
    // server-side in the wrapper, so the caller can't control the target).
    const [submittedFormData] = mocks.submitContactToSheets.mock.calls[0];
    expect(submittedFormData).toBeInstanceOf(FormData);
    expect(submittedFormData.get('name')).toBe('Inban');
    expect(submittedFormData.get('lastKnownEmail')).toBe('inban@example.com');
    expect(submittedFormData.get('response')).toBe('Hello!');
  });

  it('throws an error when required fields are missing', async () => {
    const fd = makeFormData({});
    await expect(submitPublicInquiry(fd)).rejects.toThrow('Name is required.');

    expect(mocks.submitContactToSheets).not.toHaveBeenCalled();
  });

  it('throws validation error if email is provided but invalid', async () => {
    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'not-an-email',
      response: 'Hello!',
    });

    await expect(submitPublicInquiry(fd)).rejects.toThrow(
      'Please enter a valid email.'
    );

    expect(mocks.submitContactToSheets).not.toHaveBeenCalled();
  });

  it('throws validation error if response is over 1500 chars', async () => {
    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'a'.repeat(1501),
    });

    await expect(submitPublicInquiry(fd)).rejects.toThrow(
      'Response is too long (max 1500 characters).'
    );

    expect(mocks.submitContactToSheets).not.toHaveBeenCalled();
  });

  it('logs the internal error but surfaces only a generic message when the submission fails', async () => {
    mocks.submitContactToSheets.mockRejectedValueOnce(
      new Error('Sheets is down')
    );

    const fd = makeFormData({
      name: 'Inban',
      lastKnownEmail: 'inban@example.com',
      response: 'Test',
    });

    const error = await submitPublicInquiry(fd).catch((e: unknown) => e);

    // The caller sees a generic message, never the raw internal error.
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      'We could not submit your inquiry right now. Please try again later.'
    );
    expect((error as Error).message).not.toContain('Sheets is down');

    // The full internal error is still logged server-side for diagnosis.
    expect(mocks.loggerError).toHaveBeenCalledWith(
      'Public inquiry submission error:',
      expect.objectContaining({ message: 'Sheets is down' })
    );
  });
});
