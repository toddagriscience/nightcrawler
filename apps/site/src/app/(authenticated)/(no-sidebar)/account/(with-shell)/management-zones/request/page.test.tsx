// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
const actor = vi.hoisted(() => vi.fn());
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: actor,
}));
vi.mock('./actions', () => ({ requestManagementZone: vi.fn() }));
vi.mock('./management-zone-request-form', () => ({
  default: () => <div>Request form</div>,
}));
import ManagementZoneRequestPage from './page';

describe('request page permission', () => {
  it('shows the request form for a farm Admin', async () => {
    actor.mockResolvedValue({ id: 3, farmId: 2, role: 'Admin' });
    render(await ManagementZoneRequestPage());
    expect(screen.getByText('Request form')).toBeInTheDocument();
  });
  it('keeps the form unavailable to Viewers', async () => {
    actor.mockResolvedValue({ id: 3, farmId: 2, role: 'Viewer' });
    render(await ManagementZoneRequestPage());
    expect(screen.queryByText('Request form')).not.toBeInTheDocument();
    expect(
      screen.getByText('Ask a farm Admin to request a management zone.')
    ).toBeInTheDocument();
  });
});
