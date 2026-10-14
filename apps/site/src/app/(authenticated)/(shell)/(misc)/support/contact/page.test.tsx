// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import ClientContactPage from './page';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  context: vi.fn(),
  submit: vi.fn(),
  form: vi.fn(),
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
vi.mock('./actions', () => ({ submitClientContact: mocks.submit }));
vi.mock('./inference-context', () => ({
  loadInferenceContactContext: mocks.context,
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('./components/contact-form', () => ({
  ContactForm: ({
    senderEmail,
    farmName,
    initialValues,
    submitAction,
  }: {
    senderEmail: string;
    farmName: string;
    initialValues?: { subject: string; message: string };
    submitAction: (input: {
      subject: string;
      message: string;
    }) => Promise<unknown>;
  }) => {
    mocks.form({ initialValues, submitAction });
    return (
      <p>
        {senderEmail} · {farmName}
      </p>
    );
  },
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
  mocks.context.mockResolvedValue(null);
  mocks.submit.mockResolvedValue({ success: true, id: 42 });
});

describe('ClientContactPage', () => {
  it('prefills an authorized search and binds its opaque token to the send action', async () => {
    const token = '2ad9a2b1-d203-4bdf-80d2-1c91c5c24124';
    mocks.context.mockResolvedValue({
      token,
      id: 42,
      questions: ['Original question', 'Follow-up'],
      managementZone: { id: 12, name: 'North field' },
    });
    render(
      await ClientContactPage({
        searchParams: Promise.resolve({ context: token }),
      })
    );
    expect(
      screen.getByText('Management zone: North field')
    ).toBeInTheDocument();
    expect(mocks.form.mock.calls[0][0].initialValues).toEqual({
      subject: 'Question from inference search',
      message: '1. Original question\n\n2. Follow-up',
    });
    await mocks.form.mock.calls[0][0].submitAction({
      subject: 'Edited subject',
      message: 'Edited message',
    });
    expect(mocks.submit).toHaveBeenCalledWith(
      { subject: 'Edited subject', message: 'Edited message' },
      token
    );
  });

  it('shows a safe missing-context notice without passing a foreign draft token to the form', async () => {
    render(
      await ClientContactPage({
        searchParams: Promise.resolve({
          context: '2ad9a2b1-d203-4bdf-80d2-1c91c5c24124',
        }),
      })
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'saved search could not be loaded'
    );
    expect(mocks.form.mock.calls[0][0].initialValues).toBeUndefined();
    expect(mocks.form.mock.calls[0][0].submitAction).toBe(mocks.submit);
  });
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
