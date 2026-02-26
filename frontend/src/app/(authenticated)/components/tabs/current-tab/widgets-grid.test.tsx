// Copyright © Todd Agriscience, Inc. All rights reserved.

import { updateWidget } from '@/components/common/widgets/actions';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import WidgetsGrid from './widgets-grid';

const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

vi.mock('@/components/common/widgets/actions', () => ({
  updateWidget: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('react-grid-layout', () => ({
  __esModule: true,
  default: ({
    children,
    onDragStart,
    onDragStop,
  }: {
    children: React.ReactNode;
    onDragStart?: (...args: any[]) => void;
    onDragStop?: (...args: any[]) => void;
  }) => (
    <div>
      <button
        onClick={() =>
          onDragStart?.([], null, null, null, new Event('dragstart'))
        }
      >
        start-drag
      </button>
      <button
        onClick={() =>
          onDragStop?.(
            [{ i: 'Calcium Widget', x: 1, y: 2, w: 5, h: 5 }],
            null,
            null,
            null,
            new Event('dragend')
          )
        }
      >
        stop-drag
      </button>
      {children}
    </div>
  ),
  useContainerWidth: () => ({
    width: 1200,
    mounted: true,
    containerRef: { current: null },
  }),
}));

describe('WidgetsGrid', () => {
  it('shows overlay and handles drag lifecycle callbacks + widget persistence', async () => {
    const onWidgetDragStart = vi.fn();
    const onWidgetDragStop = vi.fn();

    render(
      <WidgetsGrid
        widgets={
          [
            {
              id: 1,
              name: 'Calcium Widget',
              managementZone: 42,
              widgetMetadata: { i: 'Calcium Widget', x: 0, y: 0 },
            },
          ] as any
        }
        currentTab={
          {
            id: 1,
            name: 'Zone A',
            managementZone: 42,
            user: 1,
          } as any
        }
        renderedWidgets={<div>Widget</div>}
        showDotGrid={true}
        onWidgetDragStart={onWidgetDragStart}
        onWidgetDragStop={onWidgetDragStop}
      />
    );

    expect(screen.getByTestId('tab-dot-grid-overlay')).toBeInTheDocument();

    fireEvent.click(screen.getByText('start-drag'));
    expect(onWidgetDragStart).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('stop-drag'));

    await waitFor(() => {
      expect(onWidgetDragStop).toHaveBeenCalledTimes(1);
      expect(updateWidget).toHaveBeenCalledWith(42, 'Calcium Widget', {
        widgetMetadata: {
          i: 'Calcium Widget',
          x: 1,
          y: 2,
        },
      });
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
  });
});
