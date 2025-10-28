// Copyright Todd LLC, All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import InvestorsPage from './page';

describe('InvestorsPage', () => {
  it('renders the page', () => {
    renderWithNextIntl(<InvestorsPage />);

    expect(
      screen.getByText(
        'Todd is building a team that embodies diversity of thought, experience and background.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Learn about Todd Agriscience's investment opportunities, governance structure, and leadership team."
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Investment Opportunities')).toBeInTheDocument();
  });

  it('has correct margins', () => {
    const { container } = renderWithNextIntl(<InvestorsPage />);

    expect(container.querySelector('.mt-4')).toBeInTheDocument();
  });
});
