// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import SocialLinks, { SOCIAL_LINKS } from './social-links';

/**
 * Expected accessible names and URLs, hardcoded on purpose. Reading them out of
 * `SOCIAL_LINKS` would make these assertions tautological: any typo or
 * regression in the shared constant would silently change both sides.
 */
const EXPECTED_LINKS = [
  {
    platform: 'x',
    label: 'Visit our X (Twitter) page',
    href: 'https://x.com/toddagriscience',
  },
  {
    platform: 'instagram',
    label: 'Visit our Instagram page',
    href: 'https://www.instagram.com/toddagriscience/',
  },
  {
    platform: 'linkedin',
    label: 'Visit our LinkedIn page',
    href: 'https://www.linkedin.com/company/toddagriscience/',
  },
  {
    platform: 'youtube',
    label: 'Visit our YouTube channel',
    href: 'https://www.youtube.com/@toddagriscience',
  },
] as const;

describe('SocialLinks', () => {
  it('renders every platform by default with its expected href and label', () => {
    render(<SocialLinks />);

    for (const { label, href } of EXPECTED_LINKS) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', href);
    }

    expect(screen.getAllByRole('link')).toHaveLength(EXPECTED_LINKS.length);
  });

  it('covers every platform in the shared constant', () => {
    expect(Object.keys(SOCIAL_LINKS).sort()).toEqual(
      EXPECTED_LINKS.map(({ platform }) => platform).sort()
    );
  });

  it('renders only the requested platforms, in order', () => {
    render(<SocialLinks platforms={['linkedin', 'x']} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/toddagriscience/'
    );
    expect(links[0]).toHaveAccessibleName('Visit our LinkedIn page');
    expect(links[1]).toHaveAttribute('href', 'https://x.com/toddagriscience');
    expect(links[1]).toHaveAccessibleName('Visit our X (Twitter) page');
  });

  it('stays in the same tab by default so the accessible name stays accurate', () => {
    render(<SocialLinks platforms={['instagram']} />);

    const link = screen.getByRole('link', {
      name: 'Visit our Instagram page',
    });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('opens links safely in a new tab when asked', () => {
    render(<SocialLinks platforms={['instagram']} newTab />);

    const link = screen.getByRole('link', {
      name: 'Visit our Instagram page',
    });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('exposes hrefs and labels free of stray whitespace', () => {
    for (const { href, label } of Object.values(SOCIAL_LINKS)) {
      expect(href).toBe(href.trim());
      expect(label).toBe(label.trim());
    }
  });

  it('lets `contents` replace the default `flex` display', () => {
    // The marketing footer passes `contents` so the icons become direct
    // children of its flex row and share its gap. That only works if
    // tailwind-merge drops the component's own `flex`; a standalone `flex`
    // surviving the merge would give the icons their own row again.
    render(<SocialLinks platforms={['instagram']} className="contents" />);

    const container = screen.getByRole('link', {
      name: 'Visit our Instagram page',
    }).parentElement;
    const classes = container?.className.split(/\s+/) ?? [];

    expect(classes).toContain('contents');
    expect(classes).not.toContain('flex');
  });
});
