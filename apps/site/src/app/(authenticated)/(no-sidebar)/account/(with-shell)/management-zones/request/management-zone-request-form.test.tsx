// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ManagementZoneRequestForm from './management-zone-request-form';
const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

function fillForm() {
  fireEvent.change(screen.getByLabelText('Zone name'), {
    target: { value: 'North field' },
  });
  fireEvent.change(screen.getByLabelText('Location'), {
    target: { value: 'West of the barn' },
  });
}

beforeEach(() => vi.clearAllMocks());

describe('management zone request form', () => {
  it('validates required details without writing a request', async () => {
    const action = vi.fn();
    render(<ManagementZoneRequestForm submitRequest={action} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Request management zone' })
    );
    expect(await screen.findByText('Enter a zone name.')).toBeInTheDocument();
    expect(await screen.findByText('Enter a location.')).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });
  it('submits parcel details and opens the requested pending zone', async () => {
    const action = vi.fn().mockResolvedValue({ success: true, zoneId: 7 });
    render(<ManagementZoneRequestForm submitRequest={action} />);
    fillForm();
    fireEvent.change(screen.getByLabelText('Acreage (optional)'), {
      target: { value: '12.5' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Request management zone' })
    );
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/?zone=7'));
    expect(action).toHaveBeenCalledWith({
      name: 'North field',
      location: 'West of the barn',
      acreage: 12.5,
    });
    expect(router.refresh).toHaveBeenCalled();
  });
  it('prevents repeat submission while pending and retains the form on failure', async () => {
    let finish: (value: { success: false; error: string }) => void = () => {};
    const action = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    render(<ManagementZoneRequestForm submitRequest={action} />);
    fillForm();
    fireEvent.click(
      screen.getByRole('button', { name: 'Request management zone' })
    );
    expect(
      await screen.findByRole('button', { name: 'Submitting…' })
    ).toBeDisabled();
    finish({ success: false, error: 'Unable to submit your request.' });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to submit your request.'
    );
    expect(screen.getByLabelText('Zone name')).toHaveValue('North field');
    expect(router.push).not.toHaveBeenCalled();
  });
});
