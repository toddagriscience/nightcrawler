// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { redirect, permanentRedirect, notFound } from 'next/navigation';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import LegacyCareersArticleRedirect from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

const { getArticleBySlugMock, isInternalArticleMock, isCareerArticleMock } =
  vi.hoisted(() => ({
    getArticleBySlugMock: vi.fn(),
    isInternalArticleMock: vi.fn(),
    isCareerArticleMock: vi.fn(),
  }));

vi.mock('@/lib/sanity/articles', () => ({
  getArticleBySlug: getArticleBySlugMock,
  isInternalArticle: isInternalArticleMock,
  isCareerArticle: isCareerArticleMock,
}));

describe('Legacy /careers/[slug] redirect handler', () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear();
    vi.mocked(permanentRedirect).mockClear();
    vi.mocked(notFound).mockClear();
    getArticleBySlugMock.mockReset();
    isInternalArticleMock.mockReset();
    isCareerArticleMock.mockReset();
  });

  it('redirects externally when off-site URL is set', async () => {
    const article = {
      _id: '1',
      _type: 'news',
      title: 'External role',
      slug: { current: 'ext' },
      offSiteUrl: 'https://jobs.example/ext',
      summary: '',
      contentType: 'careers' as const,
    };
    getArticleBySlugMock.mockResolvedValueOnce(article);
    isCareerArticleMock.mockReturnValueOnce(true);
    isInternalArticleMock.mockReturnValueOnce(false);

    await LegacyCareersArticleRedirect({
      params: Promise.resolve({ locale: 'en', slug: 'ext' }),
    });

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('https://jobs.example/ext');
  });

  it('permanent-redirects internal articles to /index/[slug]', async () => {
    const article = {
      _id: '2',
      _type: 'news',
      title: 'Internal posting',
      slug: { current: 'internal-role' },
      summary: '',
      collections: ['careers'] as const,
    };
    getArticleBySlugMock.mockResolvedValueOnce(article);
    isCareerArticleMock.mockReturnValueOnce(true);
    isInternalArticleMock.mockReturnValueOnce(true);

    await LegacyCareersArticleRedirect({
      params: Promise.resolve({ locale: 'es', slug: 'internal-role' }),
    });

    expect(redirect).not.toHaveBeenCalled();
    expect(permanentRedirect).toHaveBeenCalledWith('/es/index/internal-role');
  });

  it('calls notFound when article is not career-classified', async () => {
    getArticleBySlugMock.mockResolvedValueOnce({
      _id: '3',
      _type: 'news',
      title: 'News piece',
      slug: { current: 'press-hit' },
      summary: '',
      contentType: 'news',
    });
    isCareerArticleMock.mockReturnValueOnce(false);

    await LegacyCareersArticleRedirect({
      params: Promise.resolve({ locale: 'en', slug: 'press-hit' }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('calls notFound when article is missing', async () => {
    getArticleBySlugMock.mockResolvedValueOnce(null);

    await LegacyCareersArticleRedirect({
      params: Promise.resolve({ locale: 'en', slug: 'missing' }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
