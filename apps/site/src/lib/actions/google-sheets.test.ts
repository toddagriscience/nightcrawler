// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitContactToSheets } from './google-sheets';

const ORIGINAL_URL = process.env.CONTACT_GOOGLE_SCRIPT_URL;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  process.env.CONTACT_GOOGLE_SCRIPT_URL = ORIGINAL_URL;
});

describe('submitContactToSheets', () => {
  it('throws a config error when CONTACT_GOOGLE_SCRIPT_URL is not set', async () => {
    delete process.env.CONTACT_GOOGLE_SCRIPT_URL;

    await expect(submitContactToSheets({ email: 'a@b.com' })).rejects.toThrow(
      'Server configuration error: Missing CONTACT_GOOGLE_SCRIPT_URL'
    );
  });

  it('posts to the server-configured URL, not a caller-supplied one', async () => {
    process.env.CONTACT_GOOGLE_SCRIPT_URL = 'https://script.example.com/exec';

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ status: 'success' }), { status: 200 })
      );

    await submitContactToSheets({ email: 'a@b.com' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain('https://script.example.com/exec');
  });
});
