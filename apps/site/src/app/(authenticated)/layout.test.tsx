// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getUserEmail } from '@/lib/auth-server';
import { logger } from '@/lib/logger';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { Children, type ReactElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthenticatedLayout from './layout';

const query = vi.hoisted(() => vi.fn<() => Promise<unknown[]>>());

vi.mock('@nightcrawler/db/schema/connection', () => {
  const builder = {
    from: vi.fn(() => builder),
    leftJoin: vi.fn(() => builder),
    where: vi.fn(() => builder),
    limit: query,
  };
  return { db: { select: vi.fn(() => builder) } };
});

vi.mock('@/lib/auth-server', () => ({ getUserEmail: vi.fn() }));
vi.mock('@/lib/auth-client', () => ({ logout: vi.fn() }));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
vi.mock('@/lib/fonts', () => ({ fontVariables: 'test-fonts' }));
vi.mock('@/components/common/desktop-gate/desktop-gate', () => ({
  default: () => null,
}));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

const user = {
  id: 1184,
  farmId: 1184,
  firstName: 'Local',
  lastName: 'Reviewer',
  email: 'review@example.test',
  role: 'Viewer',
};

async function renderAuthenticatedLayout() {
  const layout = AuthenticatedLayout({
    children: <p>Private farm content</p>,
  });
  const body = Children.only(layout.props.children) as ReactElement<{
    children: ReactNode;
  }>;
  const suspense = Children.only(body.props.children) as ReactElement<{
    children: ReactNode;
  }>;
  const gate = Children.only(suspense.props.children) as ReactElement<{
    children: ReactNode;
  }>;
  // Resolve the async server gate wired by the actual root layout, then render
  // its real fallback or nested content through React Testing Library.
  const Gate = gate.type as (props: {
    children: ReactNode;
  }) => Promise<ReactNode>;
  render(await Gate(gate.props));
}

describe('authenticated layout database failures', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getUserEmail).mockResolvedValue(user.email);
  });

  it('renders the controlled fallback and logs the failed user query once', async () => {
    const error = new Error('connect ECONNREFUSED');
    query.mockRejectedValueOnce(error);

    await renderAuthenticatedLayout();

    expect(
      screen.getByRole('heading', {
        name: 'Something went wrong. Please logout and try again.',
      })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeVisible();
    expect(screen.queryByText('Private farm content')).not.toBeInTheDocument();
    expect(query).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledExactlyOnceWith(
      'Error querying for current user',
      { error, email: user.email }
    );
  });

  it('renders the same fallback when the viewer agreement query fails', async () => {
    const error = new Error('agreement database unavailable');
    query
      .mockResolvedValueOnce([{ user, farmApproved: true }])
      .mockRejectedValueOnce(error);

    await renderAuthenticatedLayout();

    expect(
      screen.getByRole('heading', {
        name: 'Something went wrong. Please logout and try again.',
      })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'System Status' })).toHaveAttribute(
      'href',
      'https://status.toddagriscience.com'
    );
    expect(screen.queryByText('Private farm content')).not.toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledExactlyOnceWith(
      'Error checking account agreement',
      { error, userId: user.id }
    );
  });

  it('keeps the agreement redirect outside the database-error catch', async () => {
    const redirectError = new Error('NEXT_REDIRECT');
    vi.mocked(redirect).mockImplementation(() => {
      throw redirectError;
    });
    query.mockResolvedValueOnce([{ user, farmApproved: true }]);
    query.mockResolvedValueOnce([]);

    await expect(renderAuthenticatedLayout()).rejects.toBe(redirectError);

    expect(redirect).toHaveBeenCalledExactlyOnceWith('/account/agreement');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('renders nested content after the viewer has accepted the agreement', async () => {
    query.mockResolvedValueOnce([{ user, farmApproved: true }]);
    query.mockResolvedValueOnce([{ id: 1 }]);

    await renderAuthenticatedLayout();

    expect(screen.getByText('Private farm content')).toBeVisible();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('does not query viewer agreements for administrators', async () => {
    query.mockResolvedValueOnce([
      { user: { ...user, role: 'Admin' }, farmApproved: true },
    ]);

    await renderAuthenticatedLayout();

    expect(screen.getByText('Private farm content')).toBeVisible();
    expect(query).toHaveBeenCalledOnce();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('does not load private content or query the database without an email', async () => {
    vi.mocked(getUserEmail).mockResolvedValue(null);

    await renderAuthenticatedLayout();

    expect(screen.getByRole('button', { name: 'Logout' })).toBeVisible();
    expect(screen.queryByText('Private farm content')).not.toBeInTheDocument();
    expect(query).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });
});
