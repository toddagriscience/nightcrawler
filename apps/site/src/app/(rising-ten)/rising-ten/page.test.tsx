// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import RisingTenPage from './page';

describe('RisingTenPage', () => {
  it('leads with the opening statement as the page heading', () => {
    render(<RisingTenPage />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /every year a handful of teenagers build something real/i,
      })
    ).toBeInTheDocument();
  });

  it('states the size and the intensity of the cohort', () => {
    render(<RisingTenPage />);
    expect(
      screen.getByText(/five months hard enough to break the version of you/i)
    ).toBeVisible();
  });

  it('announces the first cohort as open, free, and selective', () => {
    render(<RisingTenPage />);
    expect(screen.getByText(/cohort one is open/i)).toBeInTheDocument();
    expect(
      screen.getByText(/costs nothing, and almost nobody gets in/i)
    ).toBeVisible();
  });

  it('closes on the choice rather than a call to action', () => {
    render(<RisingTenPage />);
    expect(
      screen.getByText(/only one of those is on the table/i)
    ).toBeInTheDocument();
  });

  it('never explains how anyone is selected', () => {
    // The way in is deliberately withheld — it is what makes someone write in.
    render(<RisingTenPage />);
    expect(screen.queryByText(/apply/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/nominat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/todd finds/i)).not.toBeInTheDocument();
  });

  it('locks the Rising Ten wordmark up with the Todd Founder Program', () => {
    render(<RisingTenPage />);
    // The logotype spells "Todd", so between the two the lockup reads
    // "Todd Founder Program" to a screen reader as well as on screen.
    expect(screen.getByText('Rising Ten')).toBeInTheDocument();
    expect(screen.getByAltText('Todd')).toBeInTheDocument();
    expect(screen.getByText('Founder Program')).toBeInTheDocument();
  });

  it('names the collaboration with the Todd Founder Program', () => {
    render(<RisingTenPage />);
    expect(
      screen.getByText(
        /a collaboration between rising ten and the todd founder/i
      )
    ).toBeInTheDocument();
  });

  it('offers a mailto route for reaching out', () => {
    render(<RisingTenPage />);
    const contact = screen.getByRole('link');
    expect(contact).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });
});
