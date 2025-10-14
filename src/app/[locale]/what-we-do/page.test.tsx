// Copyright Todd LLC, All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import WhatWeDoPage from './page';
import '@testing-library/jest-dom';

describe('WhatWeDoPage', () => {
  it('renders page sections', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    // Check page title and description
    expect(screen.getByText('What We Do')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Transforming agriculture through innovative solutions and sustainable practices'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Our Offerings')).toBeInTheDocument();
    expect(screen.getByText('Soil Remineralization')).toBeInTheDocument();
    expect(screen.getByText('Crop Production')).toBeInTheDocument();

    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('Partners')).toBeInTheDocument();
  });

  it('renders all service cards with icons', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
    expect(screen.getAllByText('Echo Innovations')).toHaveLength(2);
  });

  it('renders all impact cards', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    const impactCards = screen.getAllByText(/2023/);
    expect(impactCards).toHaveLength(6);
  });
});
