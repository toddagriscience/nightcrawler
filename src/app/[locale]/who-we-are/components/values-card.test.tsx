// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import ValuesCard from './values-card';
import '@testing-library/jest-dom';

describe('ValuesCard', () => {
  it('renders the Values title', () => {
    renderWithNextIntl(<ValuesCard />);
    expect(screen.getByText('Values')).toBeInTheDocument();
  });

  it('renders value items structure', () => {
    const { container } = renderWithNextIntl(<ValuesCard />);

    // Check for value titles structure (h4 elements)
    const valueTitles = container.querySelectorAll('h4');
    expect(valueTitles.length).toBeGreaterThan(0);

    // Check for value descriptions (p elements)
    const valueDescriptions = container.querySelectorAll('p');
    expect(valueDescriptions.length).toBeGreaterThan(0);
  });
});
