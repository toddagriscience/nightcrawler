// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ list: vi.fn(), authorize: vi.fn() }));
vi.mock('./actions', () => ({ getGeneralImps: mocks.list }));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('./components/catalog-client', () => ({
  CatalogClient: () => <h1>General IMP catalog</h1>,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
import Page from './page';
beforeEach(() => {
  vi.resetAllMocks();
  mocks.authorize.mockResolvedValue({ id: 1 });
  mocks.list.mockResolvedValue([]);
});
it('renders the catalog for staff', async () => {
  render(await Page());
  expect(
    screen.getByRole('heading', { name: 'General IMP catalog' })
  ).toBeInTheDocument();
});
it('shows a load error rather than an empty catalog when the database fails', async () => {
  mocks.list.mockRejectedValue(new Error('offline'));
  render(await Page());
  expect(screen.getByRole('alert')).toHaveTextContent('could not be loaded');
});
it('does not swallow unauthorized access', async () => {
  mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
  await expect(Page()).rejects.toThrow('Unauthorized');
  expect(mocks.list).not.toHaveBeenCalled();
});
