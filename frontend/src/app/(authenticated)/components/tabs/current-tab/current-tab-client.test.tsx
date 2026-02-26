// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CurrentTabClient from './current-tab-client';

const setShowDotGridMock = vi.fn();
let showDotGridMock = false;

vi.mock('./widget-grid-overlay-context', () => ({
  useWidgetGridOverlay: () => ({
    showDotGrid: showDotGridMock,
    setShowDotGrid: setShowDotGridMock,
  }),
}));

vi.mock('./widgets-grid', () => ({
  __esModule: true,
  default: ({
    showDotGrid,
    onWidgetDragStart,
    onWidgetDragStop,
  }: {
    showDotGrid: boolean;
    onWidgetDragStart?: () => void;
    onWidgetDragStop?: () => void;
  }) => (
    <div>
      <p data-testid="grid-visible">{String(showDotGrid)}</p>
      <button onClick={() => onWidgetDragStart?.()}>drag-start</button>
      <button onClick={() => onWidgetDragStop?.()}>drag-stop</button>
    </div>
  ),
}));

describe('CurrentTabClient', () => {
  const currentTab = {
    id: 1,
    name: 'Zone A',
    managementZone: 1,
    user: 1,
  };

  it('passes context visibility to grid and toggles visibility on drag start/stop', () => {
    showDotGridMock = false;
    setShowDotGridMock.mockClear();

    render(
      <CurrentTabClient
        currentTab={currentTab}
        widgets={
          [
            {
              id: 1,
              name: 'Calcium Widget',
              widgetMetadata: { i: 'Calcium Widget', x: 0, y: 0 },
            },
          ] as any
        }
        renderedWidgets={<div>Widget</div>}
      />
    );

    expect(screen.getByTestId('grid-visible')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('drag-start'));
    expect(setShowDotGridMock).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByText('drag-stop'));
    expect(setShowDotGridMock).toHaveBeenCalledWith(false);
  });

  it('shows the overlay in empty-state tabs when context visibility is enabled', () => {
    showDotGridMock = true;

    render(
      <CurrentTabClient
        currentTab={currentTab}
        widgets={[]}
        renderedWidgets={null}
      />
    );

    expect(screen.getByTestId('tab-dot-grid-overlay')).toBeInTheDocument();
  });
});
