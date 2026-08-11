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

  it('locks the mark up with the Todd Founder Program', () => {
    render(<RisingTenPage />);
    // The logotype spells "Todd", so between the two the lockup reads
    // "Todd Founder Program" to a screen reader as well as on screen.
    expect(screen.getByAltText('Rising Ten')).toBeInTheDocument();
    expect(screen.getByAltText('Todd')).toBeInTheDocument();
    expect(screen.getByText('Founder Program')).toBeInTheDocument();
  });

  it('leaves the mark unnamed on screen', () => {
    // Only Todd's half of the lockup is spelled out. The mark is left for the
    // reader to wonder about, so the name must not appear as visible text.
    const { container } = render(<RisingTenPage />);
    expect(container.textContent).not.toMatch(/rising ten/i);
  });

  it('credits the collaboration without naming itself', () => {
    render(<RisingTenPage />);
    expect(
      screen.getByText(/in collaboration with the todd founder program/i)
    ).toBeInTheDocument();
  });

  it('offers a mailto route for reaching out', () => {
    render(<RisingTenPage />);
    const contact = screen.getByRole('link');
    expect(contact).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });
});
