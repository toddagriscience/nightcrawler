// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { redirect, permanentRedirect, notFound } from 'next/navigation';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import LegacyNewsArticleRedirect from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

const { getArticleBySlugMock, isInternalArticleMock } = vi.hoisted(() => ({
  getArticleBySlugMock: vi.fn(),
  isInternalArticleMock: vi.fn(),
}));

vi.mock('@/lib/sanity/articles', () => ({
  getArticleBySlug: getArticleBySlugMock,
  isInternalArticle: isInternalArticleMock,
}));

describe('Legacy /news/[slug] redirect handler', () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear();
    vi.mocked(permanentRedirect).mockClear();
    vi.mocked(notFound).mockClear();
    getArticleBySlugMock.mockReset();
    isInternalArticleMock.mockReset();
  });

  it('redirects externally when off-site URL is set', async () => {
    getArticleBySlugMock.mockResolvedValueOnce({
      _id: '1',
      _type: 'news',
      title: 'External story',
      slug: { current: 'ext' },
      offSiteUrl: 'https://press.example/ext',
      summary: '',
    });
    isInternalArticleMock.mockReturnValueOnce(false);

    await LegacyNewsArticleRedirect({
      params: Promise.resolve({ locale: 'en', slug: 'ext' }),
    });

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('https://press.example/ext');
  });

  it('permanent-redirects internal articles to /index/[slug]', async () => {
    getArticleBySlugMock.mockResolvedValueOnce({
      _id: '2',
      _type: 'news',
      title: 'Internal piece',
      slug: { current: 'internal-piece' },
      summary: '',
    });
    isInternalArticleMock.mockReturnValueOnce(true);

    await LegacyNewsArticleRedirect({
      params: Promise.resolve({ locale: 'es', slug: 'internal-piece' }),
    });

    expect(redirect).not.toHaveBeenCalled();
    expect(permanentRedirect).toHaveBeenCalledWith('/es/index/internal-piece');
  });

  it('calls notFound when article is missing', async () => {
    getArticleBySlugMock.mockResolvedValueOnce(null);

    await LegacyNewsArticleRedirect({
      params: Promise.resolve({ locale: 'en', slug: 'missing' }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
