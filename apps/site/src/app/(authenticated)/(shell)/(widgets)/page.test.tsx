// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ actor: vi.fn(), zones: vi.fn() }));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mocks.actor,
}));
vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    select: () => ({
      from: () => ({ where: () => ({ orderBy: mocks.zones }) }),
    }),
  },
}));
vi.mock('./components/zone-template', () => ({
  default: ({ zoneId }: { zoneId: number }) => (
    <div>Selected zone {zoneId}</div>
  ),
}));
import DashboardPage from './page';

beforeEach(() => {
  mocks.actor.mockResolvedValue({ id: 3, farmId: 2, role: 'Admin' });
  mocks.zones.mockResolvedValue([]);
});

describe('dashboard zone request entry', () => {
  it('gives a zero-zone farm Admin a direct request path', async () => {
    render(await DashboardPage({ searchParams: Promise.resolve({}) }));
    expect(
      screen.getByRole('link', { name: 'Add management zone' })
    ).toHaveAttribute('href', '/account/management-zones/request');
  });
  it('directs a Viewer to their Admin without showing a submission link', async () => {
    mocks.actor.mockResolvedValue({ id: 3, farmId: 2, role: 'Viewer' });
    render(await DashboardPage({ searchParams: Promise.resolve({}) }));
    expect(
      screen.queryByRole('link', { name: 'Add management zone' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Ask a farm Admin to request a management zone.')
    ).toBeInTheDocument();
  });
  it('preserves zone selection and the oldest-zone default for existing farms', async () => {
    mocks.zones.mockResolvedValue([
      { id: 27, name: 'Oldest' },
      { id: 90, name: 'Newest' },
    ]);
    const { unmount } = render(
      await DashboardPage({ searchParams: Promise.resolve({}) })
    );
    expect(screen.getByText('Selected zone 27')).toBeInTheDocument();
    unmount();
    render(
      await DashboardPage({ searchParams: Promise.resolve({ zone: '90' }) })
    );
    expect(screen.getByText('Selected zone 90')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Add management zone' })
    ).not.toBeInTheDocument();
  });
});
