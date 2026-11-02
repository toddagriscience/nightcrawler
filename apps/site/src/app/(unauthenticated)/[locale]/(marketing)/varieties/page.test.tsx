// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VarietiesIndexPage from './page';

const { getPublicVarietiesMock } = vi.hoisted(() => ({
  getPublicVarietiesMock: vi.fn(),
}));

vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils')>();
  return {
    ...actual,
    getPublicVarieties: getPublicVarietiesMock,
  };
});

describe('VarietiesIndexPage', () => {
  beforeEach(() => {
    getPublicVarietiesMock.mockReset();
  });

  it('shows empty-state copy when no varieties are returned', async () => {
    getPublicVarietiesMock.mockResolvedValueOnce([]);
    const node = await VarietiesIndexPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    renderWithNextIntl(node);

    expect(
      screen.getByText('No varieties are listed here right now.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'General Variety List' })
    ).toBeInTheDocument();
  });

  it('renders VarietyPublicList when varieties are returned', async () => {
    getPublicVarietiesMock.mockResolvedValueOnce([
      {
        id: 1260,
        name: 'CANARY BIRD',
        description: 'rich canary yellow.',
        status: 'available',
        cropName: 'BEAN',
      },
    ]);
    const node = await VarietiesIndexPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    renderWithNextIntl(node);

    expect(
      screen.getByRole('search', { name: 'Filter varieties' })
    ).toBeInTheDocument();
    expect(screen.getByText('CANARY BIRD')).toBeInTheDocument();
  });
});
