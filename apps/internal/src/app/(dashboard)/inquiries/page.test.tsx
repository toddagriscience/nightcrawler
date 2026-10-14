// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InquiriesPage from './page';

const { getClientInquiries } = vi.hoisted(() => ({
  getClientInquiries: vi.fn(),
}));
vi.mock('./actions', () => ({
  getClientInquiries,
  markClientInquiryHandled: vi.fn(),
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
vi.mock('./components/inquiries-list', () => ({
  InquiriesList: () => <p>Inbox list</p>,
}));
beforeEach(() => {
  vi.clearAllMocks();
  getClientInquiries.mockResolvedValue([]);
});

describe('InquiriesPage', () => {
  it('renders the internal client inbox', async () => {
    render(await InquiriesPage());
    expect(
      screen.getByRole('heading', { name: 'Client inquiries' })
    ).toBeInTheDocument();
    expect(screen.getByText('Inbox list')).toBeInTheDocument();
  });
  it('reports a load failure with a reload link instead of claiming the inbox is empty', async () => {
    getClientInquiries.mockRejectedValue(new Error('database unavailable'));
    render(await InquiriesPage());
    expect(screen.getByRole('alert')).toHaveTextContent('could not be loaded');
    expect(screen.getByRole('link', { name: 'Reload inbox' })).toHaveAttribute(
      'href',
      '/inquiries'
    );
  });
});
