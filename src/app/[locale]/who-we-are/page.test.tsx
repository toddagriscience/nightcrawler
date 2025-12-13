// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import WhoWeArePage from './page';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock the ScrollShrinkWrapper component
vi.mock('@/components/landing', () => ({
  ScrollShrinkWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-shrink-wrapper">{children}</div>
  ),
}));

describe('WhoWeArePage', () => {
  it('renders the page hero section', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Learn about our mission, vision, and values that drive our work in regenerative agriculture.'
      )
    ).toBeInTheDocument();
  });

  it('renders mission and vision cards', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(screen.getByText('Mission')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Our mission is to deliver differentiated results to our clients by leveraging our complementary experience in regenerative agriculture to meet the needs of the modern farmer.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Partnering with high-growth, market-leading, branded organic and biodynamic farms focused on regenerative agriculture practices and forging deep emotional connections with their target consumers.'
      )
    ).toBeInTheDocument();
  });

  it('renders the values card', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(screen.getByText('Values')).toBeInTheDocument();
  });

  it('has proper layout structure', () => {
    const { container } = renderWithNextIntl(<WhoWeArePage />);

    // Check for ScrollShrinkWrapper
    expect(screen.getByTestId('scroll-shrink-wrapper')).toBeInTheDocument();

    // Check for background styling
    expect(container.querySelector('.bg-secondary')).toBeInTheDocument();

    // Check for grid layout
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
  });

  it('uses shadcn/ui Card components', () => {
    const { container } = renderWithNextIntl(<WhoWeArePage />);

    // Check for shadcn card styling
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
    expect(container.querySelector('.border')).toBeInTheDocument();
    expect(container.querySelector('.shadow-sm')).toBeInTheDocument();
  });

  it('applies correct responsive padding', () => {
    const { container } = renderWithNextIntl(<WhoWeArePage />);

    // Check for responsive padding
    expect(container.querySelector('.px-8')).toBeInTheDocument();
    expect(container.querySelector('.lg\\:px-16')).toBeInTheDocument();
  });
});
