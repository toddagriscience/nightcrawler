// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  getArticleCtasForPlacement,
  resolveArticleCtas,
} from './article-cta-utils';

describe('resolveArticleCtas', () => {
  it('returns configured ctas when present', () => {
    expect(
      resolveArticleCtas({
        ctas: [
          {
            label: 'Request access',
            href: '/forms/iris-access',
            placement: 'under-header',
          },
          {
            label: 'Contact us',
            href: '/en/contact',
            placement: 'footer',
          },
        ],
      })
    ).toEqual([
      {
        label: 'Request access',
        href: '/forms/iris-access',
        placement: 'under-header',
      },
      {
        label: 'Contact us',
        href: '/en/contact',
        placement: 'footer',
      },
    ]);
  });

  it('falls back to legacy footer cta fields', () => {
    expect(
      resolveArticleCtas({
        ctaLabel: ' Request access ',
        ctaHref: ' /forms/iris-access ',
      })
    ).toEqual([
      {
        label: 'Request access',
        href: '/forms/iris-access',
        placement: 'footer',
      },
    ]);
  });

  it('returns an empty list when no ctas are configured', () => {
    expect(resolveArticleCtas({})).toEqual([]);
  });
});

describe('getArticleCtasForPlacement', () => {
  it('filters ctas by placement', () => {
    expect(
      getArticleCtasForPlacement(
        {
          ctas: [
            {
              label: 'Top',
              href: '/a',
              placement: 'under-header',
            },
            {
              label: 'Bottom',
              href: '/b',
              placement: 'footer',
            },
          ],
        },
        'footer'
      )
    ).toEqual([
      {
        label: 'Bottom',
        href: '/b',
        placement: 'footer',
      },
    ]);
  });
});
