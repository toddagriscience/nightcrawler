// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { redirect, permanentRedirect, notFound } from 'next/navigation';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import CareersPostingPage from './page';

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

vi.mock('@/lib/env', () => ({
  env: { baseUrl: 'https://toddagriscience.com' },
}));

vi.mock(
  '@/app/(unauthenticated)/[locale]/(marketing)/components/cms-article-page/cms-article-page',
  () => ({
    CmsArticlePage: () => <div data-testid="cms-article-page" />,
  })
);

describe('/careers/[slug] postings', () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear();
    vi.mocked(permanentRedirect).mockClear();
    vi.mocked(notFound).mockClear();
    getArticleBySlugMock.mockReset();
    isInternalArticleMock.mockReset();
    isCareerArticleMock.mockReset();
  });

  it('permanent-redirects when off-site URL points at same legacy careers path', async () => {
    const article = {
      _id: '1b',
      _type: 'news' as const,
      title: 'Loop role',
      slug: { current: 'loop-role' },
      offSiteUrl: 'https://toddagriscience.com/en/careers/loop-role',
      summary: '',
      contentType: 'careers' as const,
    };
    getArticleBySlugMock.mockResolvedValueOnce(article);
    isCareerArticleMock.mockReturnValueOnce(true);
    isInternalArticleMock.mockReturnValueOnce(false);

    await CareersPostingPage({
      params: Promise.resolve({ locale: 'en', slug: 'loop-role' }),
    });

    expect(redirect).not.toHaveBeenCalled();
    expect(permanentRedirect).toHaveBeenCalledWith('/en/careers/loop-role');
  });

  it('redirects externally when off-site URL is set', async () => {
    const article = {
      _id: '1',
      _type: 'news' as const,
      title: 'External role',
      slug: { current: 'ext' },
      offSiteUrl: 'https://jobs.example/ext',
      summary: '',
      contentType: 'careers' as const,
    };
    getArticleBySlugMock.mockResolvedValueOnce(article);
    isCareerArticleMock.mockReturnValueOnce(true);
    isInternalArticleMock.mockReturnValueOnce(false);

    await CareersPostingPage({
      params: Promise.resolve({ locale: 'en', slug: 'ext' }),
    });

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('https://jobs.example/ext');
  });

  it('renders internal career articles', async () => {
    const article = {
      _id: '2',
      _type: 'news' as const,
      title: 'Internal posting',
      slug: { current: 'internal-role' },
      summary: '',
      collections: ['careers'] as const,
    };
    getArticleBySlugMock.mockResolvedValueOnce(article);
    isCareerArticleMock.mockReturnValueOnce(true);
    isInternalArticleMock.mockReturnValueOnce(true);

    const node = await CareersPostingPage({
      params: Promise.resolve({ locale: 'es', slug: 'internal-role' }),
    });

    render(node);
    expect(screen.getByTestId('cms-article-page')).toBeInTheDocument();
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('calls notFound when article is not career-classified', async () => {
    getArticleBySlugMock.mockResolvedValueOnce({
      _id: '3',
      _type: 'news' as const,
      title: 'News piece',
      slug: { current: 'press-hit' },
      summary: '',
      contentType: 'news' as const,
    });
    isCareerArticleMock.mockReturnValueOnce(false);

    await CareersPostingPage({
      params: Promise.resolve({ locale: 'en', slug: 'press-hit' }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('calls notFound when article is missing', async () => {
    getArticleBySlugMock.mockResolvedValueOnce(null);

    await CareersPostingPage({
      params: Promise.resolve({ locale: 'en', slug: 'missing' }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
