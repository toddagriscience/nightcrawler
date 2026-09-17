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
});
