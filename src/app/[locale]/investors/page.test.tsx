// Copyright Todd LLC, All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import InvestorsPage from './page';

// Mock framer-motion to fix ScrollShrinkWrapper issues
jest.mock('framer-motion', () => {
  const mockMotionValue = {
    get: jest.fn(() => 0),
    set: jest.fn(),
    onChange: jest.fn(),
    clearListeners: jest.fn(),
  };

  return {
    ...jest.requireActual('framer-motion'),
    useScroll: jest.fn(() => ({ scrollYProgress: mockMotionValue })),
    useTransform: jest.fn(() => mockMotionValue),
    useMotionValueEvent: jest.fn(),
    motion: {
      div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
        <div {...props}>{children}</div>
      ),
      button: ({
        children,
        ...props
      }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        children?: React.ReactNode;
      }) => <button {...props}>{children}</button>,
    },
  };
});

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
