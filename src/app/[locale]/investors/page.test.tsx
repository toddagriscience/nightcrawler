// Copyright Todd LLC, All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import InvestorsPage from './page';

describe('InvestorsPage', () => {
  it('renders the page with correct content', () => {
    renderWithNextIntl(<InvestorsPage />);

    // Check for the title from PageHero
    expect(screen.getByText('Investors')).toBeInTheDocument();

    // Check for the subtitle from PageHero
    expect(
      screen.getByText(
        'Todd is building a team that embodies diversity of thought, experience and background.'
      )
    ).toBeInTheDocument();

    // Check for the heading
    expect(screen.getByText('Investment Opportunities')).toBeInTheDocument();

    // Check for the description
    expect(
      screen.getByText(
        "Learn about Todd Agriscience's investment opportunities, governance structure, and leadership team."
      )
    ).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = renderWithNextIntl(<InvestorsPage />);

    // Check for main content structure
    expect(container.querySelector('.bg-secondary')).toBeInTheDocument();
    expect(container.querySelector('.rounded-2xl')).toBeInTheDocument();
    expect(container.querySelector('.text-center')).toBeInTheDocument();
  });
});
