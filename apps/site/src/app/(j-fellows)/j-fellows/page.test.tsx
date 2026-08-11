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
        name: /ambition shows up early/i,
      })
    ).toBeInTheDocument();
  });

  it('states the shape of the fellowship', () => {
    render(<JFellowsPage />);
    expect(screen.getByText(/ten fellows/i)).toBeInTheDocument();
    expect(
      screen.getByText(/five more of weekly mentorship/i)
    ).toBeInTheDocument();
  });

  it('announces the first cohort as open, free, and selective', () => {
    render(<JFellowsPage />);
    expect(
      screen.getByText(/applications for the first cohort are open/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/free, and it is brutally selective/i)
    ).toBeVisible();
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
