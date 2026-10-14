// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createJobPostingStructuredData,
  getJobPostingMissingFields,
  isActiveJob,
} from './job-posting';
import type { SanityArticle } from './article-types';
import {
  getArticleBySlug,
  getArticleRoutingInfo,
  getArticlesByCollection,
} from './articles';
import sitemap from '@/lib/sitemap';

const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
}));

vi.mock('@/lib/sanity/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return {
    ...actual,
    client: { config: () => actual.client.config(), fetch: fetchMock },
  };
});

const job: SanityArticle = {
  _id: 'verified-job',
  _type: 'career',
  title: 'Fixture engineer',
  slug: { current: 'engineer' },
  datePosted: '2026-10-01T00:00:00Z',
  validThrough: '2026-11-01T00:00:00Z',
  employmentTypes: ['FULL_TIME'],
  workplaceType: 'remote',
  applicantCountries: ['US'],
  applyUrl: 'https://example.com/apply',
  baseSalary: {
    currency: 'USD',
    minValue: 100000,
    maxValue: 150000,
    unitText: 'YEAR',
  },
  content: [
    {
      _key: 'body',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'text',
          marks: [],
          text: 'Build data systems. Base compensation $100000–$150000 per year.',
        },
      ],
    },
  ],
};
afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('verified active job structured data', () => {
  it('emits Google remote-job fields and the career canonical from verified source data', () => {
    const schema = createJobPostingStructuredData(
      { ...job, language: 'es' },
      Date.parse('2026-10-14T00:00:00Z')
    );
    expect(schema).toMatchObject({
      '@type': 'JobPosting',
      title: job.title,
      datePosted: job.datePosted,
      validThrough: job.validThrough,
      employmentType: ['FULL_TIME'],
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: [
        { '@type': 'Country', name: 'United States' },
      ],
      baseSalary: {
        currency: 'USD',
        value: { minValue: 100000, maxValue: 150000, unitText: 'YEAR' },
      },
    });
    expect(schema?.url).toEqual(
      expect.stringContaining('/es/careers/engineer')
    );
    expect(schema?.description).toContain('<p>Build data systems.');
  });

  it('requires an address for on-site roles and does not mark hybrid work as fully remote', () => {
    const onsite: SanityArticle = {
      ...job,
      workplaceType: 'hybrid',
      jobAddress: { addressLocality: 'New York', addressCountry: 'US' },
    };
    const schema = createJobPostingStructuredData(
      onsite,
      Date.parse('2026-10-14')
    );
    expect(schema?.jobLocation).toMatchObject({
      address: { addressLocality: 'New York', addressCountry: 'US' },
    });
    expect(schema?.jobLocationType).toBeUndefined();
    expect(
      createJobPostingStructuredData(
        { ...onsite, jobAddress: undefined },
        Date.parse('2026-10-14')
      )
    ).toBeNull();
  });

  it('excludes incomplete legacy records, general applications and unverified pay', () => {
    expect(
      getJobPostingMissingFields({
        ...job,
        datePosted: undefined,
        applicantCountries: undefined,
      })
    ).toEqual(['datePosted', 'applicantCountries']);
    expect(
      createJobPostingStructuredData(
        { ...job, datePosted: undefined },
        Date.parse('2026-10-14')
      )
    ).toBeNull();
    expect(
      createJobPostingStructuredData(
        { ...job, slug: { current: 'general-application' } },
        Date.parse('2026-10-14')
      )
    ).toBeNull();
    expect(
      createJobPostingStructuredData(
        { ...job, baseSalary: undefined },
        Date.parse('2026-10-14')
      )
    ).toBeNull();
  });

  it.each(['ZZ', 'EU', 'UN', 'XA', 'XB', 'QO'])(
    'does not emit %s as a country',
    (code) => {
      expect(
        getJobPostingMissingFields({ ...job, applicantCountries: [code] })
      ).toContain('applicantCountries');
      expect(
        createJobPostingStructuredData(
          { ...job, applicantCountries: [code] },
          Date.parse('2026-10-14')
        )
      ).toBeNull();
      expect(
        getJobPostingMissingFields({
          ...job,
          workplaceType: 'onsite',
          jobAddress: { addressLocality: 'City', addressCountry: code },
        })
      ).toContain('jobAddress');
    }
  );

  it('permits explicitly confirmed no-expiry roles and removes closed jobs', () => {
    expect(
      createJobPostingStructuredData(
        { ...job, validThrough: undefined, noExpiry: true },
        Date.parse('2026-10-14')
      )?.validThrough
    ).toBeUndefined();
    expect(
      createJobPostingStructuredData(
        { ...job, jobStatus: 'closed' },
        Date.parse('2026-10-14')
      )
    ).toBeNull();
    expect(
      isActiveJob({ ...job, jobStatus: 'closed' }, Date.parse('2026-10-14'))
    ).toBe(false);
  });

  it('drops schema, routing, listing and sitemap at expiry with the identical cached CMS document', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-31T23:59:59Z'));
    fetchMock.mockResolvedValue(job);
    expect(createJobPostingStructuredData(job)).not.toBeNull();
    expect(await getArticleBySlug('engineer')).toEqual(job);
    expect(await getArticleRoutingInfo('engineer', 'en')).toEqual(job);
    fetchMock.mockResolvedValue([job]);
    expect(await getArticlesByCollection('careers')).toHaveLength(1);
    expect(await sitemap({ id: Promise.resolve('careers') })).toHaveLength(1);

    vi.setSystemTime(new Date('2026-11-01T00:00:00Z'));
    expect(createJobPostingStructuredData(job)).toBeNull();
    fetchMock.mockResolvedValue(job);
    expect(await getArticleBySlug('engineer')).toBeNull();
    expect(await getArticleRoutingInfo('engineer', 'en')).toBeNull();
    fetchMock.mockResolvedValue([job]);
    expect(await getArticlesByCollection('careers')).toHaveLength(0);
    expect(await sitemap({ id: Promise.resolve('careers') })).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      { cache: 'no-store' }
    );
  });
});
