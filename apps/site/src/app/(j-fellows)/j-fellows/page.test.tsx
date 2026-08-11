// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import JFellowsPage from './page';

describe('JFellowsPage', () => {
  it('leads with the opening statement as the page heading', () => {
    render(<JFellowsPage />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /every year a handful of teenagers build something real/i,
      })
    ).toBeInTheDocument();
  });

  it('states the shape of the fellowship', () => {
    render(<JFellowsPage />);
    expect(screen.getByText(/ten fellows/i)).toBeInTheDocument();
    expect(screen.getByText(/five more with us in your ear/i)).toBeVisible();
    expect(
      screen.getByText(/founders, externs, and interns/i)
    ).toBeInTheDocument();
  });

  it('announces the first cohort as open, free, and selective', () => {
    render(<JFellowsPage />);
    expect(screen.getByText(/cohort one is open/i)).toBeInTheDocument();
    expect(
      screen.getByText(/costs nothing, and almost nobody gets in/i)
    ).toBeVisible();
  });

  it('closes on the choice rather than a call to action', () => {
    render(<JFellowsPage />);
    expect(
      screen.getByText(/only one of those is on the table/i)
    ).toBeInTheDocument();
  });

  it('names the collaboration with the Todd Founder Program', () => {
    render(<JFellowsPage />);
    expect(
      screen.getByText(
        /a collaboration between j fellows and the todd founder/i
      )
    ).toBeInTheDocument();
  });

  it('offers a mailto route for applying', () => {
    render(<JFellowsPage />);
    const contact = screen.getByRole('link');
    expect(contact).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('keeps the wordmark image decorative so the wordmark text is not doubled', () => {
    const { container } = render(<JFellowsPage />);
    // The mark sits beside the "J Fellows" text, so alt text would repeat it.
    // An empty alt takes it out of the accessibility tree entirely, which is
    // why this asserts on the DOM rather than by role.
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(screen.getByText('J Fellows')).toBeInTheDocument();
  });
});
