// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CurrentTabClient from './current-tab-client';

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

  it('passes visibility prop to grid and toggles visibility callbacks on drag start/stop', () => {
    const onShowDotGrid = vi.fn();
    const onHideDotGrid = vi.fn();

    render(
      <CurrentTabClient
        currentTab={currentTab}
        showDotGrid={false}
        onShowDotGrid={onShowDotGrid}
        onHideDotGrid={onHideDotGrid}
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
    expect(onShowDotGrid).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('drag-stop'));
    expect(onHideDotGrid).toHaveBeenCalledTimes(1);
  });

  it('shows the overlay in empty-state tabs when visibility prop is enabled', () => {
    render(
      <CurrentTabClient
        currentTab={currentTab}
        showDotGrid={true}
        onShowDotGrid={() => {}}
        onHideDotGrid={() => {}}
        widgets={[]}
        renderedWidgets={null}
      />
    );

    expect(screen.getByTestId('tab-dot-grid-overlay')).toBeInTheDocument();
  });
});
