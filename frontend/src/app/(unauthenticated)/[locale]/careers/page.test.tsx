// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import Careers from './page';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('Careers page', () => {
  it('renders the page', () => {
    renderWithNextIntl(<Careers />);

    // Check that the page renders
    const h1Element = screen.getByRole('heading', { level: 1 });
    expect(h1Element).toBeInTheDocument();
  });

  it('has a level-one heading for accessibility', () => {
    const { container } = renderWithNextIntl(<Careers />);

    // Ensure there's exactly one h1 element on the page
    const h1Elements = container.querySelectorAll('h1');
    expect(h1Elements).toHaveLength(1);
  });

  it('has a main landmark region', () => {
    renderWithNextIntl(<Careers />);

    // Check that main landmark exists
    const mainLandmark = screen.getByRole('main');
    expect(mainLandmark).toBeInTheDocument();
  });

  it('contains page content within the main landmark', () => {
    const { container } = renderWithNextIntl(<Careers />);

    const mainLandmark = screen.getByRole('main');

    // Verify that the h1 heading is within the main landmark
    const h1Element = screen.getByRole('heading', { level: 1 });
    expect(mainLandmark).toContainElement(h1Element);

    // Verify that header images are within the main landmark
    const headerImages = container.querySelectorAll(
      'img[alt="Todd University"]'
    );
    headerImages.forEach((img) => {
      expect(mainLandmark).toContainElement(img as HTMLElement);
    });

    // Verify that all headings are within the main landmark
    const headings = screen.getAllByRole('heading');
    headings.forEach((heading) => {
      expect(mainLandmark).toContainElement(heading);
    });
  });
});
