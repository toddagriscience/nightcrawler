// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { Disclaimer } from './disclaimer';

describe('Disclaimer', () => {
  it('renders one numbered paragraph per disclaimer', () => {
    const { container } = renderWithNextIntl(
      <Disclaimer translationLoc="careers.disclaimers" disclaimerCount={2} />
    );

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent(
      /^1\. Todd is an equal opportunity/
    );
    expect(paragraphs[1]).toHaveTextContent(/^2\. Todd Agriscience, Inc\./);
  });

  it('renders rich-text link tags as locale-aware links', () => {
    renderWithNextIntl(
      <Disclaimer
        translationLoc="careers.disclaimers"
        disclaimerCount={3}
        links={{ inquiry: '/contact' }}
      />
    );

    const link = screen.getByRole('link', {
      name: 'submit an accommodation inquiry',
    });
    expect(link).toHaveAttribute('href', '/contact');
    expect(link).toHaveClass('underline');
    expect(link).not.toHaveAttribute('target');
  });

  it('opens external http(s) links in a new tab with a safe rel', () => {
    renderWithNextIntl(
      <Disclaimer
        translationLoc="careers.disclaimers"
        disclaimerCount={4}
        links={{
          inquiry: '/contact',
          coverage: 'https://example.com/pricing',
        }}
      />
    );

    const link = screen.getByRole('link', {
      name: 'view the pricing information',
    });
    expect(link).toHaveAttribute('href', 'https://example.com/pricing');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not leak the raw tag markup, an email address, or a bare URL into the copy', () => {
    const { container } = renderWithNextIntl(
      <Disclaimer
        translationLoc="careers.disclaimers"
        disclaimerCount={5}
        links={{
          inquiry: '/contact',
          coverage: 'https://example.com/pricing',
          privacy: '/privacy',
        }}
      />
    );

    expect(container.textContent).not.toMatch(/<\/?\w+>/);
    expect(container.textContent).not.toMatch(/@toddagriscience\.com/);
    expect(container.textContent).not.toMatch(/https?:\/\//);
  });

  it('merges a custom className onto the wrapping section', () => {
    const { container } = renderWithNextIntl(
      <Disclaimer
        translationLoc="careers.disclaimers"
        disclaimerCount={1}
        className="mb-0"
      />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('mb-0');
    expect(section).not.toHaveClass('mb-32');
  });
});
