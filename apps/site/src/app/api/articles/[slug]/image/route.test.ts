// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { getArticleBySlug } from '@/lib/sanity/articles';
import { GET } from './route';

vi.mock('@/lib/sanity/articles', () => ({
  getArticleBySlug: vi.fn(),
  isInternalArticle: () => true,
}));

describe('article title covers', () => {
  it('does not generate an image for an unpublished translation', async () => {
    vi.mocked(getArticleBySlug).mockResolvedValue(null);
    const response = await GET(
      new Request('http://localhost/api/articles/soil/image?locale=es'),
      { params: Promise.resolve({ slug: 'soil' }) }
    );
    expect(response.status).toBe(404);
    expect(getArticleBySlug).toHaveBeenCalledWith('soil', undefined, 'es');
  });

  it('does not generate publication covers for career documents', async () => {
    vi.mocked(getArticleBySlug).mockResolvedValue({
      _id: 'job',
      _type: 'career',
      title: 'Engineer',
      slug: { current: 'engineer' },
    });
    const response = await GET(
      new Request('http://localhost/api/articles/engineer/image'),
      { params: Promise.resolve({ slug: 'engineer' }) }
    );
    expect(response.status).toBe(404);
  });
});
