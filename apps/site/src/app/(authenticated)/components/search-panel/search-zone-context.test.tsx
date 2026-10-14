// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchPanelProvider, useSearchPanel } from './search-panel-context';
import { SearchZoneContext } from './search-zone-context';

vi.mock('@/app/(authenticated)/actions/inference-search', () => ({
  runInferenceSearch: async () => [],
}));

function SearchControls() {
  const { questions, activeManagementZoneId, submitSearch, submitFollowUp } =
    useSearchPanel();
  return (
    <>
      <button onClick={() => submitSearch('Original question')}>
        New search
      </button>
      <button onClick={() => submitFollowUp('Follow-up')}>Follow-up</button>
      <output>
        {JSON.stringify({ questions, zone: activeManagementZoneId })}
      </output>
    </>
  );
}

describe('SearchZoneContext', () => {
  it('captures the rendered zone for global searches and retains it with all follow-ups when the dashboard changes zones', () => {
    const { rerender } = render(
      <SearchPanelProvider>
        <SearchZoneContext zoneId={12} />
        <SearchControls />
      </SearchPanelProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'New search' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '{"questions":["Original question"],"zone":12}'
    );
    rerender(
      <SearchPanelProvider>
        <SearchZoneContext zoneId={13} />
        <SearchControls />
      </SearchPanelProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Follow-up' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '{"questions":["Original question","Follow-up"],"zone":12}'
    );
    fireEvent.click(screen.getByRole('button', { name: 'New search' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '{"questions":["Original question"],"zone":13}'
    );
  });

  it('does not attach a stale dashboard zone to a new search on another page', () => {
    const { rerender } = render(
      <SearchPanelProvider>
        <SearchZoneContext zoneId={12} />
        <SearchControls />
      </SearchPanelProvider>
    );
    rerender(
      <SearchPanelProvider>
        <SearchControls />
      </SearchPanelProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'New search' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '{"questions":["Original question"]}'
    );
  });
});
