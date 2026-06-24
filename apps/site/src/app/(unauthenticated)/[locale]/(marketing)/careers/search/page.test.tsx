// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CareersIndexPage from './page';

const { getArticlesByCollectionMock } = vi.hoisted(() => ({
  getArticlesByCollectionMock: vi.fn(),
}));

vi.mock('@/lib/sanity/articles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sanity/articles')>();
  return {
    ...actual,
    getArticlesByCollection: getArticlesByCollectionMock,
  };
});

describe('CareersIndexPage', () => {
  beforeEach(() => {
    getArticlesByCollectionMock.mockReset();
  });

  it('shows empty-state copy when Sanity returns no jobs', async () => {
    getArticlesByCollectionMock.mockResolvedValueOnce([]);
    const node = await CareersIndexPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    renderWithNextIntl(node);

    expect(
      screen.getByText(
        'No postings are listed here right now. See our Todd University externship program on the main careers page.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Careers at Todd' })
    ).toBeInTheDocument();
  });

  it('renders CareersJobList when Sanity returns jobs', async () => {
    const job: SanityArticle = {
      _id: 'job-1',
      _type: 'career',
      title: 'Sanity Mock Role',
      slug: { current: 'sanity-mock-role' },
      summary: '',
    };
    getArticlesByCollectionMock.mockResolvedValueOnce([job]);
    const node = await CareersIndexPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    renderWithNextIntl(node);

    expect(
      screen.getByRole('search', { name: 'Filter job postings' })
    ).toBeInTheDocument();
    expect(screen.getByText('Sanity Mock Role')).toBeInTheDocument();
  });
});
