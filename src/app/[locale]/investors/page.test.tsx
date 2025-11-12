// Copyright Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import InvestorsPage from './page';

// Mock ScrollShrinkWrapper to avoid framer-motion issues
jest.mock('@/components/landing', () => ({
  ScrollShrinkWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-shrink-wrapper">{children}</div>
  ),
}));

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
    renderWithNextIntl(<InvestorsPage />);

    // Check for the mocked ScrollShrinkWrapper
    expect(screen.getByTestId('scroll-shrink-wrapper')).toBeInTheDocument();

    // Check for main content structure within the component
    const { container } = renderWithNextIntl(<InvestorsPage />);
    expect(container.querySelector('.bg-secondary')).toBeInTheDocument();
    expect(container.querySelector('.rounded-2xl')).toBeInTheDocument();
    expect(container.querySelector('.text-center')).toBeInTheDocument();
  });
});
