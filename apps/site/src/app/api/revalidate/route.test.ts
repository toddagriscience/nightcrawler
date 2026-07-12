// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  default: { warn: vi.fn(), error: vi.fn() },
  logger: { warn: vi.fn(), error: vi.fn() },
}));

import { revalidatePath } from 'next/cache';

function makeRequest(secret?: string, body?: unknown): Request {
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: secret ? { 'x-revalidate-secret': secret } : {},
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret');
  });

  it('returns 503 when the secret is not configured', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', '');
    const res = await POST(makeRequest('test-secret'));
    expect(res.status).toBe(503);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('returns 401 for a missing or wrong secret', async () => {
    const missing = await POST(makeRequest());
    expect(missing.status).toBe(401);

    const wrong = await POST(makeRequest('nope'));
    expect(wrong.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('revalidates the whole route cache with a valid secret', async () => {
    const res = await POST(makeRequest('test-secret', { _type: 'news' }));
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    const json = (await res.json()) as {
      revalidated: boolean;
      documentType: string | null;
    };
    expect(json.revalidated).toBe(true);
    expect(json.documentType).toBe('news');
  });

  it('handles a missing body gracefully', async () => {
    const res = await POST(makeRequest('test-secret'));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { documentType: string | null };
    expect(json.documentType).toBeNull();
  });
});
