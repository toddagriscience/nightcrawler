// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ZoneItem from './zone-item';

describe('ZoneItem', () => {
  it('renders the zone name linking to its zone view', () => {
    render(<ZoneItem id={7} name="North Field" index={0} />);
    const link = screen.getByRole('link', { name: /North Field/i });
    expect(link).toHaveAttribute('href', '/?zone=7');
  });

  it('renders a 1-based keyboard badge from the zero-based index', () => {
    render(<ZoneItem id={7} name="North Field" index={2} />);
    expect(screen.getByText('Alt 3')).toBeInTheDocument();
  });

  it('does not render a status indicator dot', () => {
    const { container } = render(
      <ZoneItem id={7} name="North Field" index={0} />
    );
    expect(container.querySelector('.bg-green-500')).not.toBeInTheDocument();
  });

  it('exposes no delete control (read-only row)', () => {
    render(<ZoneItem id={7} name="North Field" index={0} />);
    expect(
      screen.queryByRole('button', { name: /delete/i })
    ).not.toBeInTheDocument();
  });
});
