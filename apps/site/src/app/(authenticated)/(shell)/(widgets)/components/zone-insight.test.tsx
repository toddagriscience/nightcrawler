// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ZoneInsight } from './zone-insight';

describe('ZoneInsight', () => {
  it('renders summary and recommended action', () => {
    render(
      <ZoneInsight
        summary="Highest pH in the set, with lower zinc and manganese than most zones. Calcium, magnesium, and potassium are moderate."
        action="Focus on nutrient availability at the higher pH level, especially zinc and manganese. Compare this zone with neighboring fields before making a field-specific adjustment."
      />
    );

    expect(
      screen.getByText(
        'Highest pH in the set, with lower zinc and manganese than most zones. Calcium, magnesium, and potassium are moderate.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Recommended action')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Focus on nutrient availability at the higher pH level, especially zinc and manganese. Compare this zone with neighboring fields before making a field-specific adjustment.'
      )
    ).toBeInTheDocument();
  });

  it('renders summary without an action block', () => {
    render(
      <ZoneInsight summary="Highest pH in the set, with lower zinc and manganese than most zones. Calcium, magnesium, and potassium are moderate." />
    );

    expect(
      screen.getByText(
        'Highest pH in the set, with lower zinc and manganese than most zones. Calcium, magnesium, and potassium are moderate.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText('Recommended action')).toBeNull();
  });

  it('renders action without a summary', () => {
    render(
      <ZoneInsight action="Focus on nutrient availability at the higher pH level, especially zinc and manganese. Compare this zone with neighboring fields before making a field-specific adjustment." />
    );

    expect(screen.getByText('Recommended action')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Focus on nutrient availability at the higher pH level, especially zinc and manganese. Compare this zone with neighboring fields before making a field-specific adjustment.'
      )
    ).toBeInTheDocument();
  });

  it('renders nothing when both fields are empty', () => {
    const { container } = render(<ZoneInsight summary="  " action={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
