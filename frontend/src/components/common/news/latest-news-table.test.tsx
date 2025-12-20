// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import { LatestNewsTable } from './latest-news-table';
import '@testing-library/jest-dom';
import { act } from 'react';
import { SanityDocument } from 'next-sanity';
import { describe, it, expect } from 'vitest';

const items = [
  {
    title: 'New AI Model Sets Performance Record',
    source: 'TechCrunch',
    date: '2024-11-20T10:00:00.000Z',
    slug: { current: 'new-ai-model-sets-record' },
    offSiteUrl: null,
  },
  {
    title: 'Local Startup Raises $12M in Funding',
    source: 'Bloomberg',
    date: '2024-11-18T08:30:00.000Z',
    slug: { current: 'startup-raises-12m' },
    offSiteUrl: 'https://toddagriscience.com/startup-raises-12m',
  },
  {
    title: 'Breakthrough in Renewable Energy Tech',
    source: 'Wired',
    date: '2024-10-02T14:45:00.000Z',
    slug: { current: 'renewable-energy-breakthrough' },
    offSiteUrl: null,
  },
  {
    title: 'New Security Protocol Announced',
    source: 'The Verge',
    date: '2024-09-15T09:15:00.000Z',
    slug: { current: 'new-security-protocol' },
    offSiteUrl: 'https://theverge.com/new-security-protocol',
  },
  {
    title: 'Global Markets Show Strong Growth',
    source: 'Reuters',
    date: '2024-09-01T12:20:00.000Z',
    slug: { current: 'global-markets-growth' },
    offSiteUrl: null,
  },
];

describe('LatestNewsTable', () => {
  it('is temporary', () => {
    expect(true).toBeTruthy();
  });
});
