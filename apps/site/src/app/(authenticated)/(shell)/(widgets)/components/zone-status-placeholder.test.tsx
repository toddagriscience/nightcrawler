// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ZoneStatusPlaceholder } from './zone-status-placeholder';

describe('ZoneStatusPlaceholder', () => {
  it('renders the pending copy', () => {
    render(<ZoneStatusPlaceholder status="pending" />);

    expect(
      screen.getByRole('heading', {
        name: 'This management zone is pending.',
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Appeal' })).toBeNull();
  });

  it('renders the rejected copy and an Appeal button', () => {
    render(<ZoneStatusPlaceholder status="rejected" />);

    expect(
      screen.getByRole('heading', { name: 'This zone was rejected.' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'This management zone did not meet current program requirements.'
      )
    ).toBeInTheDocument();

    const appeal = screen.getByRole('button', { name: 'Appeal' });
    expect(appeal.tagName).toBe('BUTTON');
  });
});
