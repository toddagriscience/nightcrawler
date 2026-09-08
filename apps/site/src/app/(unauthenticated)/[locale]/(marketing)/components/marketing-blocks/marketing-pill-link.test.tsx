// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PAGE_HEADER_BUTTON_CLASSNAME } from '@/components/common/page-header/page-header';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import {
  MARKETING_PILL_LINK_CLASSNAME,
  MarketingPillLink,
} from './marketing-pill-link';

describe('MarketingPillLink', () => {
  it('uses the same outline pill classes as PageHeader', () => {
    expect(MARKETING_PILL_LINK_CLASSNAME).toBe(PAGE_HEADER_BUTTON_CLASSNAME);

    renderWithNextIntl(
      <MarketingPillLink href="/research">View research</MarketingPillLink>
    );

    const link = screen.getByRole('link', { name: 'View research' });
    expect(link).toHaveAttribute('href', '/research');
    expect(link).toHaveClass('h-[44px]', 'w-fit', 'rounded-full', 'px-[20px]');
  });

  it('opens outbound hrefs in a new tab', () => {
    renderWithNextIntl(
      <MarketingPillLink href="https://jobs.example/apply">
        Apply now
      </MarketingPillLink>
    );

    const link = screen.getByRole('link', { name: 'Apply now' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
