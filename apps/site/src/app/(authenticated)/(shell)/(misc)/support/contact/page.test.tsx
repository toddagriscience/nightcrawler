// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import ClientContactPage from './page';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('Not found');
  }),
}));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mocks.authenticate,
}));
vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: { select: () => ({ from: () => ({ where: mocks.where }) }) },
}));
vi.mock('./actions', () => ({ submitClientContact: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('./components/contact-form', () => ({
  ContactForm: ({
    senderEmail,
    farmName,
  }: {
    senderEmail: string;
    farmName: string;
  }) => (
    <p>
      {senderEmail} · {farmName}
    </p>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authenticate.mockResolvedValue({
    id: 7,
    farmId: 3,
    firstName: 'Alex',
    lastName: 'Client',
    email: 'alex@example.test',
  });
  mocks.where.mockReturnValue({ limit: mocks.limit });
  mocks.limit.mockResolvedValue([{ name: 'Green Acres' }]);
});

describe('ClientContactPage', () => {
  it('renders the contact form for the session farm', async () => {
    render(await ClientContactPage());
    expect(
      screen.getByRole('heading', { name: 'Contact your advisor' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('alex@example.test · Green Acres')
    ).toBeInTheDocument();
    expect(
      new PgDialect().sqlToQuery(mocks.where.mock.calls[0][0]).params
    ).toEqual([3]);
  });
  it('does not render a form for a missing farm record', async () => {
    mocks.limit.mockResolvedValue([]);
    await expect(ClientContactPage()).rejects.toThrow('Not found');
  });
});
