// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  save: vi.fn(),
  error: vi.fn(),
}));
vi.mock('@/app/(dashboard)/imps/catalog/actions', () => ({
  getGeneralImps: mocks.list,
  saveGeneralImp: mocks.save,
}));
vi.mock('sonner', () => ({ toast: { error: mocks.error, success: vi.fn() } }));
import { CatalogClient } from './catalog-client';
import type { GeneralImp } from '../types';
const date = new Date('2026-01-01');
const imp: GeneralImp = {
  id: 1,
  knowledgeArticleId: 2,
  title: 'Zinc',
  slug: 'zinc-low',
  content: '**Apply carefully.**',
  tags: ['soil'],
  triggerRaw: 'low @zinc',
  sourceContentHash: null,
  createdAt: date,
  updatedAt: date,
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.list.mockResolvedValue([imp]);
});
it('shows existing advice, explicit missing ranges and the source reconciliation workflow', () => {
  render(<CatalogClient initialImps={[imp]} />);
  expect(screen.getByText('Apply carefully.')).toBeInTheDocument();
  expect(screen.getByText('No ideal practice.')).toBeInTheDocument();
  expect(screen.getByText('No high practice.')).toBeInTheDocument();
  expect(
    screen.getByText(/spreadsheet is the source of truth/)
  ).toBeInTheDocument();
});
it('retains user input after a failed save and supplies the existing revision', async () => {
  mocks.save.mockResolvedValue({
    ok: false,
    error: 'Embedding service unavailable.',
  });
  render(<CatalogClient initialImps={[imp]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Edit zinc-low' }));
  fireEvent.change(screen.getByLabelText('Body (Markdown)'), {
    target: { value: 'Revised advice' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save general IMP' }));
  await waitFor(() =>
    expect(mocks.error).toHaveBeenCalledWith('Embedding service unavailable.')
  );
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByLabelText('Body (Markdown)')).toHaveValue(
    'Revised advice'
  );
  expect(screen.getByLabelText('Slug')).toHaveAttribute('readonly');
  expect(mocks.save).toHaveBeenCalledWith(
    expect.objectContaining({ content: 'Revised advice' }),
    { id: 1, updatedAt: date.toISOString() }
  );
});
