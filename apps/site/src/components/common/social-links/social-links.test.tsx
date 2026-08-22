// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import SocialLinks, { SOCIAL_LINKS } from './social-links';

describe('SocialLinks', () => {
  it('renders every platform by default with its shared href and label', () => {
    render(<SocialLinks />);

    for (const { href, label } of Object.values(SOCIAL_LINKS)) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', href);
    }
  });

  it('renders only the requested platforms, in order', () => {
    render(<SocialLinks platforms={['linkedin', 'x']} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', SOCIAL_LINKS.linkedin.href);
    expect(links[1]).toHaveAttribute('href', SOCIAL_LINKS.x.href);
  });

  it('stays in the same tab by default so the accessible name stays accurate', () => {
    render(<SocialLinks platforms={['instagram']} />);

    const link = screen.getByRole('link', {
      name: SOCIAL_LINKS.instagram.label,
    });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('opens links safely in a new tab when asked', () => {
    render(<SocialLinks platforms={['instagram']} newTab />);

    const link = screen.getByRole('link', {
      name: SOCIAL_LINKS.instagram.label,
    });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('exposes hrefs free of stray whitespace', () => {
    for (const { href } of Object.values(SOCIAL_LINKS)) {
      expect(href).toBe(href.trim());
    }
  });
});
