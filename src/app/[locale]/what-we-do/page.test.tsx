// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import WhatWeDoPage from './page';
import '@testing-library/jest-dom';

// Mock the ScrollShrinkWrapper component
jest.mock('@/components/landing', () => ({
  ScrollShrinkWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-shrink-wrapper">{children}</div>
  ),
}));

describe('WhatWeDoPage', () => {
  it('renders the page hero section', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(screen.getByText('What We Do')).toBeInTheDocument();
    expect(
      screen.getByText(
        'We partner with high-growth, market-leading farms to advance regenerative agriculture and create lasting value for stakeholders and the environment.'
      )
    ).toBeInTheDocument();
  });

  it('renders the approach section', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(screen.getByText('Our Approach')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Todd Agriscience is a first-generation regenerative agriculture firm/
      )
    ).toBeInTheDocument();
  });

  it('renders the services section with all four services', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(screen.getByText('What We Offer')).toBeInTheDocument();
    expect(screen.getByText('Strategic Partnerships')).toBeInTheDocument();
    expect(screen.getByText('Operational Expertise')).toBeInTheDocument();
    expect(screen.getByText('Market Leadership')).toBeInTheDocument();
    expect(screen.getByText('Sustainable Growth')).toBeInTheDocument();
  });

  it('renders the focus areas section with all three areas', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(screen.getByText('Our Focus Areas')).toBeInTheDocument();
    expect(screen.getByText('Regenerative Agriculture')).toBeInTheDocument();
    expect(
      screen.getByText('Organic & Biodynamic Farming')
    ).toBeInTheDocument();
    expect(screen.getByText('Branded Market Leaders')).toBeInTheDocument();
  });

  it('has proper layout structure', () => {
    const { container } = renderWithNextIntl(<WhatWeDoPage />);

    // Check for ScrollShrinkWrapper
    expect(screen.getByTestId('scroll-shrink-wrapper')).toBeInTheDocument();

    // Check for background styling
    expect(container.querySelector('.bg-secondary')).toBeInTheDocument();

    // Check for grid layouts
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-3')).toBeInTheDocument();
  });

  it('uses shadcn/ui Card components', () => {
    const { container } = renderWithNextIntl(<WhatWeDoPage />);

    // Check for shadcn card styling
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
    expect(container.querySelector('.border')).toBeInTheDocument();
    expect(container.querySelector('.shadow-sm')).toBeInTheDocument();
  });

  it('applies correct responsive padding', () => {
    const { container } = renderWithNextIntl(<WhatWeDoPage />);

    // Check for responsive padding
    expect(container.querySelector('.px-8')).toBeInTheDocument();
    expect(container.querySelector('.lg\\:px-16')).toBeInTheDocument();
  });

  it('displays all service descriptions', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(
      screen.getByText(
        /We form deep partnerships with high-growth, market-leading farms/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Our team brings complementary experience in agriculture operations/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We work with branded farms that forge deep emotional connections/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We focus on creating long-term value through sustainable practices/
      )
    ).toBeInTheDocument();
  });

  it('displays all focus area descriptions', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(
      screen.getByText(
        /Supporting farms that prioritize soil health, biodiversity/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Partnering with certified organic and biodynamic operations/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Working with farms that have established strong brand identities/
      )
    ).toBeInTheDocument();
  });
});
