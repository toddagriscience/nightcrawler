// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  getArticleCardHref,
  getInternalArticlePath,
  isSelfReferentialArticleUrl,
} from '@/lib/sanity/article-urls';
import { describe, expect, it } from 'vitest';

describe('getInternalArticlePath', () => {
  it('returns `/index/{slug}` path', () => {
    expect(getInternalArticlePath('my-article')).toBe('/index/my-article');
  });
});

describe('getArticleCardHref', () => {
  it('prefers off-site URL when defined', () => {
    expect(
      getArticleCardHref({
        offSiteUrl: 'https://example.com/story',
        slug: { current: 'ignored' },
      })
    ).toBe('https://example.com/story');
  });

  it('uses internal path when off-site URL is empty', () => {
    expect(
      getArticleCardHref({
        offSiteUrl: '',
        slug: { current: 'local-article' },
      })
    ).toBe('/index/local-article');
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
