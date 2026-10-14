// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MineralLevelWidgetProps } from '@/components/common/widgets/mineral-level-widget/types';
import { ZoneMineralCharts } from './zone-mineral-charts';

vi.mock(
  '@/components/common/widgets/mineral-level-widget/mineral-level-widget',
  () => ({
    default: () => <div data-testid="mineral-level-widget" />,
  })
);

const calciumProps: MineralLevelWidgetProps = {
  min: 0,
  max: 200.4,
  standards: { low: 100.2, ideal: 150.3, high: 200.4 },
  chartData: [
    {
      y: 0,
      x: 148,
      realValue: 148,
      date: new Date('2025-09-15'),
      unit: 'ppm',
    },
  ],
};

describe('ZoneMineralCharts', () => {
  it('renders a labeled chart', () => {
    render(
      <ZoneMineralCharts charts={[{ label: 'Calcium', props: calciumProps }]} />
    );

    expect(screen.getByText('Calcium')).toBeInTheDocument();
    expect(screen.getByTestId('mineral-level-widget')).toBeInTheDocument();
  });

  it('renders nothing when there are no charts', () => {
    const { container } = render(<ZoneMineralCharts charts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
