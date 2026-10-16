// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ManagementZoneRequestRow } from '@nightcrawler/db/queries';
const mocks = vi.hoisted(() => ({ update: vi.fn(), refresh: vi.fn() }));
vi.mock('../actions', () => ({ updateZoneRequest: mocks.update }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
import ZoneRequestsClient from './zone-requests-client';

const request: ManagementZoneRequestRow = {
  id: 5,
  farmId: 2,
  farmName: 'Review farm',
  requesterEmail: 'client@example.test',
  createdAt: new Date('2026-01-01'),
  hasAnalysis: false,
  answers: {
    name: 'North field',
    location: 'Barn',
    acreage: 12,
    zoneId: 7,
    requestedByUserId: 3,
    stage: 'requested',
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.update.mockResolvedValue({ success: true });
});

describe('staff sample request queue', () => {
  it('records shipment and refreshes the queue', async () => {
    render(<ZoneRequestsClient requests={[request]} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Mark sample kit sent' })
    );
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalled());
    expect(mocks.update).toHaveBeenCalledWith(5, 'sample_kit_sent');
    expect(screen.getByLabelText('Under review')).toBeInTheDocument();
  });
  it('keeps processing disabled without an analysis and directs staff to existing analysis entry', () => {
    render(
      <ZoneRequestsClient
        requests={[
          {
            ...request,
            answers: { ...request.answers, stage: 'sample_kit_sent' },
          },
        ]}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Mark processed' })
    ).toBeDisabled();
    expect(
      screen.getByRole('link', { name: 'Enter soil analysis for zone #7' })
    ).toHaveAttribute('href', '/analyses');
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it('allows processing after an analysis exists and retains server validation errors', async () => {
    mocks.update.mockResolvedValue({
      success: false,
      error: 'Analysis was removed. Reload and try again.',
    });
    render(
      <ZoneRequestsClient
        requests={[
          {
            ...request,
            hasAnalysis: true,
            answers: { ...request.answers, stage: 'sample_kit_sent' },
          },
        ]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Mark processed' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Analysis was removed.'
    );
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
});
