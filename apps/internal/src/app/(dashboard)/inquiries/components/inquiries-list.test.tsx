// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InquiriesList } from './inquiries-list';
import type { ClientInquiry } from '../types';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
const inquiry: ClientInquiry = {
  id: 42,
  farmId: 3,
  farmName: 'Green Acres',
  subject: 'Soil results',
  message: '<script>unsafe()</script>',
  senderName: 'Alex Client',
  senderEmail: 'alex@example.test',
  createdAt: new Date('2026-10-14T05:00:00Z'),
  reviewedAt: null,
};
beforeEach(() => {
  vi.clearAllMocks();
});

describe('InquiriesList', () => {
  it('shows sender and farm context while rendering client text safely', () => {
    const { container } = render(
      <InquiriesList inquiries={[inquiry]} handleAction={vi.fn()} />
    );
    expect(
      screen.getByRole('heading', { name: 'Soil results' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Request 42 · Green Acres (farm 3)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Alex Client · alex@example.test')
    ).toBeInTheDocument();
    expect(screen.getByText(inquiry.message)).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
  });
  it('marks a successfully updated request handled and refreshes server data', async () => {
    const action = vi.fn().mockResolvedValue({ success: true });
    render(<InquiriesList inquiries={[inquiry]} handleAction={action} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Mark request 42 handled' })
    );
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Handled')
    );
    expect(action).toHaveBeenCalledWith(42);
    expect(refresh).toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Mark request 42 handled' })
    ).not.toBeInTheDocument();
  });
  it('keeps a request new and actionable when its update fails', async () => {
    const action = vi
      .fn()
      .mockResolvedValue({ success: false, message: 'Try again.' });
    render(<InquiriesList inquiries={[inquiry]} handleAction={action} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Mark request 42 handled' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Try again.');
    expect(screen.getByRole('status')).toHaveTextContent('New');
    expect(
      screen.getByRole('button', { name: 'Mark request 42 handled' })
    ).toBeEnabled();
  });
  it('shows a useful empty inbox', () => {
    render(<InquiriesList inquiries={[]} handleAction={vi.fn()} />);
    expect(screen.getByText('No client inquiries yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh inbox' }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
