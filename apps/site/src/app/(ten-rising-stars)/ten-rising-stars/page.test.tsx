// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import TenRisingStarsPage from './page';

describe('TenRisingStarsPage', () => {
  it('leads with the opening statement as the page heading', () => {
    render(<TenRisingStarsPage />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /every year a handful of teenagers build something real/i,
      })
    ).toBeInTheDocument();
  });

  it('states the size and the intensity of the cohort', () => {
    render(<TenRisingStarsPage />);
    expect(
      screen.getByText(/five months hard enough to break the version of you/i)
    ).toBeVisible();
  });

  it('announces the first cohort as open, free, and selective', () => {
    render(<TenRisingStarsPage />);
    expect(screen.getByText(/cohort one is open/i)).toBeInTheDocument();
    expect(
      screen.getByText(/costs nothing, and almost nobody gets in/i)
    ).toBeVisible();
  });

  it('closes on the choice rather than a call to action', () => {
    render(<TenRisingStarsPage />);
    expect(
      screen.getByText(/only one of those is on the table/i)
    ).toBeInTheDocument();
  });

  it('never explains how anyone is selected', () => {
    // The way in is deliberately withheld — it is what makes someone write in.
    render(<TenRisingStarsPage />);
    expect(screen.queryByText(/apply/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/nominat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/todd finds/i)).not.toBeInTheDocument();
  });

  it('locks the two marks together', () => {
    render(<TenRisingStarsPage />);
    // Both are images, so alt text is the only name either one has.
    expect(screen.getByAltText('Ten Rising Stars')).toBeInTheDocument();
    expect(screen.getByAltText('Todd')).toBeInTheDocument();
  });

  it('names itself inside the statement rather than in the lockup', () => {
    // The name lands once, mid-argument, where it reads as a fact about the
    // cohort. The header stays wordless so the mark is still the thing a
    // reader has to ask about.
    const { container } = render(<TenRisingStarsPage />);
    expect(container.querySelector('header')?.textContent?.trim()).toBe('');
    expect(
      screen.getByText(/ten rising stars\. five months hard enough/i)
    ).toBeInTheDocument();
  });

  it('credits the collaboration without naming itself', () => {
    render(<TenRisingStarsPage />);
    expect(
      screen.getByText(/in collaboration with the todd founder program/i)
    ).toBeInTheDocument();
  });

  it('offers a mailto route for reaching out', () => {
    render(<TenRisingStarsPage />);
    const contact = screen.getByRole('link');
    expect(contact).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });
});
