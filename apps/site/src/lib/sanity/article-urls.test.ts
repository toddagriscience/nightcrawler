// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  getArticleCardHref,
  getInternalArticlePath,
  getInternalCareerArticlePath,
  isSelfReferentialArticleUrl,
} from '@/lib/sanity/article-urls';
import { describe, expect, it } from 'vitest';

describe('getInternalArticlePath', () => {
  it('returns `/index/{slug}` path', () => {
    expect(getInternalArticlePath('my-article')).toBe('/index/my-article');
  });
});

describe('getInternalCareerArticlePath', () => {
  it('returns `/careers/{slug}` path', () => {
    expect(getInternalCareerArticlePath('my-role')).toBe('/careers/my-role');
  });
});

describe('getArticleCardHref', () => {
  it('prefers off-site URL when defined', () => {
    expect(
      getArticleCardHref({
        offSiteUrl: 'https://example.com/story',
        slug: { current: 'ignored' },
        _type: 'news',
      })
    ).toBe('https://example.com/story');
  });

  it('uses internal index path when off-site URL is empty (non-career)', () => {
    expect(
      getArticleCardHref({
        offSiteUrl: '',
        slug: { current: 'local-article' },
        _type: 'news',
      })
    ).toBe('/index/local-article');
  });

  it('uses internal careers path for career documents', () => {
    expect(
      getArticleCardHref({
        slug: { current: 'local-role' },
        _type: 'career',
      })
    ).toBe('/careers/local-role');
  });
});

const base = 'https://toddagriscience.com';

describe('isSelfReferentialArticleUrl', () => {
  it('returns true for same-origin legacy careers path with matching slug', () => {
    expect(
      isSelfReferentialArticleUrl(
        `${base}/en/careers/my-role`,
        'en',
        'my-role',
        base
      )
    ).toBe(true);
  });

  it('returns true for relative index path', () => {
    expect(isSelfReferentialArticleUrl('/en/index/x', 'en', 'x', base)).toBe(
      true
    );
  });

  it('returns false for a different slug on careers', () => {
    expect(
      isSelfReferentialArticleUrl(
        `${base}/en/careers/other`,
        'en',
        'my-role',
        base
      )
    ).toBe(false);
  });

  it('returns false for unrelated external origins', () => {
    expect(
      isSelfReferentialArticleUrl(
        'https://example.com/en/careers/my-role',
        'en',
        'my-role',
        base
      )
    ).toBe(false);
  });

  it('matches www vs bare hostname', () => {
    expect(
      isSelfReferentialArticleUrl(
        'https://www.toddagriscience.com/en/index/job',
        'en',
        'job',
        'https://toddagriscience.com'
      )
    ).toBe(true);
  });
});
