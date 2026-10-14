// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { CareersJobPosting } from './careers-job-posting';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    if (key === 'jobPosting.kicker') return 'Careers';
    if (key === 'jobPosting.applyNow') return 'Apply now';
    return key;
  }),
}));

const posting = {
  _id: 'career-1',
  _type: 'career',
  title: 'Soil Scientist',
  slug: { current: 'soil-scientist' },
  jobTeam: 'Research',
  jobLocation: 'Remote',
  applyUrl: 'https://jobs.example/soil-scientist',
  summary: '',
} satisfies SanityArticle;

describe('CareersJobPosting', () => {
  it('renders the posting through PageHeader', async () => {
    renderWithNextIntl(
      await CareersJobPosting({ article: posting, locale: 'en' })
    );

    expect(screen.getByText('Careers')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Soil Scientist' })
    ).toHaveClass(
      'text-[clamp(2rem,calc(2rem+1*((100vw-23.4375rem)/66.5625)),3rem)]'
    );
    expect(screen.getByText('Research — Remote')).toHaveClass('text-[16px]');
    expect(screen.getByText('Careers').parentElement).toHaveClass(
      'mb-0',
      'md:mb-0'
    );
    const applyLinks = screen.getAllByRole('link', { name: 'Apply now' });
    expect(applyLinks[0]).toHaveAttribute(
      'href',
      'https://jobs.example/soil-scientist'
    );
    expect(applyLinks[0]).toHaveAttribute('target', '_blank');
    expect(applyLinks).toHaveLength(2);
  });
  it('shows verified recruiting facts and supplies a CSP nonce to the single schema', async () => {
    const verified: SanityArticle = {
      ...posting,
      datePosted: '2026-10-01T00:00:00Z',
      noExpiry: true,
      employmentTypes: ['FULL_TIME'],
      workplaceType: 'remote',
      applicantCountries: ['US'],
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
              _key: 'text',
              _type: 'span',
              marks: [],
              text: 'Study agricultural soils.',
            },
          ],
        },
      ],
    };
    renderWithNextIntl(
      await CareersJobPosting({
        article: verified,
        locale: 'en',
        nonce: 'fixture-nonce',
      })
    );
    expect(screen.getByText('Todd Agriscience')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText(/\$100,000/)).toBeInTheDocument();
    expect(
      document
        .querySelector('[data-job-details] time')
        ?.getAttribute('datetime')
    ).toBe(verified.datePosted);
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute('nonce', 'fixture-nonce');
    expect(JSON.parse(scripts[0].textContent ?? '{}')).toMatchObject({
      '@type': 'JobPosting',
      title: verified.title,
      datePosted: verified.datePosted,
    });
  });

  it('does not fabricate schema for legacy job documents or general-interest applications', async () => {
    renderWithNextIntl(
      await CareersJobPosting({ article: posting, locale: 'en' })
    );
    expect(
      document.querySelector('script[type="application/ld+json"]')
    ).toBeNull();
  });
});
