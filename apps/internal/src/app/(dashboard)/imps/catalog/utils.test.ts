// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { generalImpFieldsSchema, groupGeneralImps } from './utils';
import type { GeneralImp } from './types';

const imp = (
  id: number,
  triggerRaw: string | null,
  tags = ['soil']
): GeneralImp => ({
  id,
  knowledgeArticleId: id,
  slug: `imp-${id}`,
  title: null,
  tags,
  triggerRaw,
  content: 'Advice',
  sourceContentHash: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('catalog inputs and range display', () => {
  it('strips forged database and embedding fields and validates limits', () => {
    const result = generalImpFieldsSchema.parse({
      title: ' Zinc ',
      slug: 'zinc-low',
      tags: 'soil, soil, zinc',
      triggerRaw: 'low @zinc',
      content: ' advice ',
      id: 42,
      knowledgeArticleId: 99,
      updatedAt: 'forged',
      embedding: [1],
    });
    expect(result).toEqual({
      title: 'Zinc',
      slug: 'zinc-low',
      tags: ['soil', 'zinc'],
      triggerRaw: 'low @zinc',
      content: 'advice',
    });
    expect(
      generalImpFieldsSchema.safeParse({ ...result, tags: '', content: ' ' })
        .success
    ).toBe(false);
    expect(
      generalImpFieldsSchema.safeParse({
        ...result,
        tags: '',
        slug: '../escape',
      }).success
    ).toBe(false);
  });
  it('groups simple matching nutrient ranges without mixing categories or guessing compound triggers', () => {
    const rows = [
      imp(1, 'low @zinc'),
      imp(2, 'ideal @zinc'),
      imp(3, 'HIGH @zinc'),
      imp(4, 'low @zinc', ['corn']),
      imp(5, '@four_lows'),
      imp(6, 'low @zinc + @water'),
      imp(7, null),
    ];
    const { ranges, other } = groupGeneralImps(rows);
    expect(ranges).toHaveLength(2);
    expect(ranges[0].low.map((row) => row.id)).toEqual([1]);
    expect(ranges[0].ideal.map((row) => row.id)).toEqual([2]);
    expect(ranges[0].high.map((row) => row.id)).toEqual([3]);
    expect(other.map((row) => row.id)).toEqual([5, 6, 7]);
  });
});
