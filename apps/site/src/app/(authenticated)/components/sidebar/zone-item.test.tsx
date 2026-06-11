// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ZoneItem from './zone-item';

vi.mock(
  '@/app/(authenticated)/(accounts)/account/(with-shell)/management-zones/[zone]/actions',
  () => ({
    deleteManagementZone: vi.fn(async () => ({})),
  })
);

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

describe('ZoneItem', () => {
  it('renders zone name as a link', () => {
    render(<ZoneItem id={1} index={0} name="North Field" />);
    const link = screen.getByRole('link', { name: /North Field/i });
    expect(link).toHaveAttribute('href', '/?zone=1');
  });

  it('renders a 1-based keyboard badge from the zero-based index', () => {
    render(<ZoneItem id={5} index={2} name="North Field" />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders the delete affordance', () => {
    render(<ZoneItem id={1} index={0} name="North Field" />);
    expect(
      screen.getByRole('button', { name: /Delete North Field/i })
    ).toBeInTheDocument();
  });

  it('renders with active state when isActive is true', () => {
    render(<ZoneItem id={1} index={0} name="North Field" isActive={true} />);
    expect(screen.getByText(/North Field/i)).toBeInTheDocument();
  });

  it('renders with active state when isActive is false', () => {
    render(<ZoneItem id={1} index={0} name="South Field" isActive={false} />);
    expect(screen.getByText(/South Field/i)).toBeInTheDocument();
  });

  it('renders with default active state when isActive not provided', () => {
    render(<ZoneItem id={1} index={0} name="East Field" />);
    expect(screen.getByText(/East Field/i)).toBeInTheDocument();
  });
});
