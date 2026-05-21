// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import { CareersLandingView } from './components/careers-landing';
import { CAREERS_LANDING_VIEW_FIXTURE } from './fixtures/careers-landing-view.fixture';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('Careers landing view', () => {
  it('renders the page', () => {
    renderWithNextIntl(
      <CareersLandingView copy={CAREERS_LANDING_VIEW_FIXTURE} />
    );

    const h1Element = screen.getByRole('heading', { level: 1 });
    expect(h1Element).toHaveTextContent('Build the future');
  });

  it('has a level-one heading for accessibility', () => {
    const { container } = renderWithNextIntl(
      <CareersLandingView copy={CAREERS_LANDING_VIEW_FIXTURE} />
    );

    const h1Elements = container.querySelectorAll('h1');
    expect(h1Elements).toHaveLength(1);
  });

  it('has a main landmark region', () => {
    renderWithNextIntl(
      <CareersLandingView copy={CAREERS_LANDING_VIEW_FIXTURE} />
    );

    const mainLandmark = screen.getByRole('main');
    expect(mainLandmark).toBeInTheDocument();
  });

  it('anchors values pill and routes footer CTA to listings', () => {
    renderWithNextIntl(
      <CareersLandingView copy={CAREERS_LANDING_VIEW_FIXTURE} />
    );

    const mainLandmark = screen.getByRole('main');
    const h1Element = screen.getByRole('heading', { level: 1 });
    expect(mainLandmark).toContainElement(h1Element);

    const valuesLink = screen.getByRole('link', { name: 'View careers' });
    expect(valuesLink).toHaveAttribute('href', '/careers/search');

    const listingLink = screen.getByRole('link', {
      name: 'View careers →',
    });
    expect(listingLink).toHaveAttribute('href', '/careers/search');

    screen.getAllByRole('heading', { level: 2 }).forEach((heading) => {
      expect(mainLandmark).toContainElement(heading);
    });
  });
});
