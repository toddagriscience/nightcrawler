// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cloneElement, isValidElement, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import { describe, expect, it, vi } from 'vitest';
import { toPhRange } from './to-ph-range';
import { ZonePhRange } from './zone-ph-range';

global.ResizeObserver = ResizeObserver;

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) =>
      isValidElement(children)
        ? cloneElement(children, { width: 800, height: 64 } as never)
        : children,
  };
});

const HARDEN_TARGET = { phLow: 7.3, phHigh: 7.8 };

function renderPh(model: ReturnType<typeof toPhRange>) {
  return render(
    <div style={{ width: 800, height: 200 }}>
      <ZonePhRange {...model} />
    </div>
  );
}

describe('ZonePhRange', () => {
  it('renders the Harden 7 within-range state without Low or ppm', () => {
    renderPh(toPhRange({ value: 7.4, ...HARDEN_TARGET }));

    expect(screen.getByText('Within target range')).toBeInTheDocument();
    expect(screen.getByText('pH 7.4')).toBeInTheDocument();
    expect(screen.queryByText('More acidic')).toBeNull();
    expect(screen.queryByText('Target range')).toBeNull();
    expect(screen.queryByText('Low')).toBeNull();
    expect(screen.queryByText(/ppm/i)).toBeNull();
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('8.0')).toBeInTheDocument();

    expect(screen.getByTestId('ph-range-marker')).toHaveAttribute(
      'data-plotted',
      '7.4'
    );
    expect(
      screen.getByRole('img', { name: /target range 7\.3 to 7\.8/i })
    ).toBeInTheDocument();
  });

  it('places the marker away from the right edge for an in-domain reading', () => {
    renderPh(toPhRange({ value: 7.4, ...HARDEN_TARGET }));

    expect(screen.getByTestId('ph-range-marker')).not.toHaveAttribute(
      'data-plotted',
      '8'
    );
  });

  it('renders below and above target copy', () => {
    const { rerender } = renderPh(toPhRange({ value: 6.8, ...HARDEN_TARGET }));
    expect(screen.getByText('Below target range')).toBeInTheDocument();
    expect(screen.getByText('pH 6.8')).toBeInTheDocument();

    rerender(
      <div style={{ width: 800, height: 200 }}>
        <ZonePhRange {...toPhRange({ value: 7.9, ...HARDEN_TARGET })} />
      </div>
    );
    expect(screen.getByText('Above target range')).toBeInTheDocument();
    expect(screen.getByText('pH 7.9')).toBeInTheDocument();
  });

  it('renders the missing-target fallback and still shows the reading', () => {
    renderPh(toPhRange({ value: 7.4, phLow: null, phHigh: null }));

    expect(screen.getByText(/Target range not configured/)).toBeInTheDocument();
    expect(screen.getByText(/pH 7.4/)).toBeInTheDocument();
    expect(screen.queryByText('Below target range')).toBeNull();
    expect(screen.queryByText('Within target range')).toBeNull();
    expect(screen.queryByText('Above target range')).toBeNull();
    expect(screen.queryByText('More acidic')).toBeNull();
    expect(screen.queryByRole('img', { name: /target range \d/i })).toBeNull();
  });

  it('formats clamped readings as pH, not ppm', () => {
    renderPh(toPhRange({ value: 9.0, ...HARDEN_TARGET }));

    expect(screen.getByText('Above target range')).toBeInTheDocument();
    expect(screen.getByText('pH 9.0')).toBeInTheDocument();
    expect(screen.queryByText(/ppm/i)).toBeNull();
    expect(screen.getByTestId('ph-range-marker')).toHaveAttribute(
      'data-plotted',
      '8'
    );
  });
});
