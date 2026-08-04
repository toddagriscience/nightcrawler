// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client, defaultSanityFetchOptions } from '@/lib/sanity/client';
import { getFormBySlug } from '@/lib/sanity/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/sanity/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sanity/client')>();
  return { ...actual, client: { fetch: vi.fn() } };
});

const fetchMock = vi.mocked(client.fetch);

describe('getFormBySlug', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('applies the default revalidate window when the caller passes no options', async () => {
    await getFormBySlug('contact');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      { slug: 'contact' },
      defaultSanityFetchOptions
    );
  });

  it('preserves an explicit no-store override', async () => {
    await getFormBySlug('contact', { cache: 'no-store' });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      { slug: 'contact' },
      { cache: 'no-store' }
    );
  });
});
