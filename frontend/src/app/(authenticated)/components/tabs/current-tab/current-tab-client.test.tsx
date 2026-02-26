// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import CurrentTabClient from './current-tab-client';

vi.mock('@/components/common/widgets/add-widget-dropdown', () => ({
  __esModule: true,
  default: ({
    children,
    onOpenChange,
    onWidgetSelected,
  }: {
    children: React.ReactNode;
    onOpenChange?: (isOpen: boolean) => void;
    onWidgetSelected?: () => void;
  }) => (
    <div>
      <button onClick={() => onOpenChange?.(true)}>open-dropdown</button>
      <button onClick={() => onOpenChange?.(false)}>close-dropdown</button>
      <button onClick={() => onWidgetSelected?.()}>select-widget</button>
      {children}
    </div>
  ),
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

  it('toggles dot-grid visibility when dropdown opens/selects and when dragging starts/stops', () => {
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
        unusedWidgets={['Macro Radar'] as any}
        renderedWidgets={<div>Widget</div>}
      />
    );

    expect(screen.getByTestId('grid-visible')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('open-dropdown'));
    expect(screen.getByTestId('grid-visible')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('select-widget'));
    expect(screen.getByTestId('grid-visible')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('drag-start'));
    expect(screen.getByTestId('grid-visible')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('drag-stop'));
    expect(screen.getByTestId('grid-visible')).toHaveTextContent('false');
  });

  it('shows the overlay in empty-state tabs only while dropdown is open', () => {
    render(
      <CurrentTabClient
        currentTab={currentTab}
        widgets={[]}
        unusedWidgets={['Macro Radar'] as any}
        renderedWidgets={null}
      />
    );

    expect(
      screen.queryByTestId('tab-dot-grid-overlay')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('open-dropdown'));
    expect(screen.getByTestId('tab-dot-grid-overlay')).toBeInTheDocument();

    fireEvent.click(screen.getByText('select-widget'));
    expect(
      screen.queryByTestId('tab-dot-grid-overlay')
    ).not.toBeInTheDocument();
  });
});
