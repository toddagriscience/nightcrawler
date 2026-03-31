// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import CreatorsPage from './page';

describe('CreatorsPage', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Creator Program')).toBeInTheDocument();
  });

  it('has an Apply link', () => {
    renderWithNextIntl(<CreatorsPage />);
    const applyLinks = screen.getAllByRole('link', { name: /apply/i });
    expect(applyLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Creator Program section', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Creator Program')).toBeInTheDocument();
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });

  it('renders the How it works section', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('How it works')).toBeInTheDocument();
  });

  it('renders the Benefits section with all four items', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(
      screen.getByText("Network with Todd's community")
    ).toBeInTheDocument();
    expect(
      screen.getByText('Earn special offers throughout the year')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Make content people actually engage with')
    ).toBeInTheDocument();
    expect(screen.getByText('Attend exclusive events')).toBeInTheDocument();
  });
});
