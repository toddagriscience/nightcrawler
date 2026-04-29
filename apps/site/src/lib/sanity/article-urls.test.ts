// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  getArticleCardHref,
  getInternalArticlePath,
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
