// Copyright © Todd Agriscience, Inc. All rights reserved.

import privacyMessages from '@/messages/privacy/en.json';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import PrivacyPage from './page';

const { california } = privacyMessages.privacy;

describe('PrivacyPage', () => {
  it('renders the page', () => {
    renderWithNextIntl(<PrivacyPage />);

    expect(
      screen.getByText(
        'Visitors that are residents of California should refer to our Website Privacy Policy Supplement for California Residents.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Headings and captions throughout this Privacy Policy are for convenience only and should not be considered part of this Privacy Policy. The word including means including without limitation.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "This EU-UK Privacy Policy does not apply to any processing of personal data by or on behalf of Todd that is covered by a more specific privacy policy (including, without limitation, our employee and contractor privacy policies and our Service and/or Product User Agreement's privacy policies)."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Should you wish to lodge a complaint with regards to how your personal data has been processed by us:'
      )
    ).toBeInTheDocument();
  });

  it('states the legal bases for processing under EU-UK law', () => {
    renderWithNextIntl(<PrivacyPage />);

    // This paragraph shared the `legal` message key with the disclosure
    // paragraph below it. JSON keeps the last of two duplicate keys, so it
    // reached no visitor and the disclosure text printed in both slots.
    expect(
      screen.getByText(/^We rely on various legal bases under the EU-UK/)
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(
        /^We reserve the right to disclose your personal information/
      )
    ).toHaveLength(1);
  });

  it('introduces the list of information a disclosure request covers', () => {
    renderWithNextIntl(<PrivacyPage />);

    // Rendered in place of an empty `content` key that left the CCPA list
    // standing under a blank paragraph with nothing to introduce it.
    expect(
      screen.getByText(california.rights.disclosure.intro)
    ).toBeInTheDocument();
  });

  it('labels whether each category of personal information is collected', () => {
    renderWithNextIntl(<PrivacyPage />);

    // Counted from the message file rather than restated here, so the two
    // cannot drift apart.
    expect(screen.getAllByText(/^Collected: (YES|NO)$/)).toHaveLength(
      Object.keys(california.categories).length
    );
  });

  it('points the Japanese contact sentence at the contact page', () => {
    renderWithNextIntl(<PrivacyPage />);

    // 此方 means "here" — the link belongs on that word, which the sentence
    // already points at, not trailing the sentence as an English fragment.
    const link = screen.getByRole('link', { name: '此方' });
    expect(link).toHaveAttribute('href', expect.stringContaining('/contact'));
  });

  it('keeps the heading outline from skipping a level', () => {
    const { container } = renderWithNextIntl(<PrivacyPage />);

    // The category cards used to jump straight from the supplement's h2 to an
    // h4, leaving screen reader users a hole in the outline.
    const levels = Array.from(
      container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).map((heading) => Number(heading.tagName[1]));

    const skipped = levels.filter(
      (level, index) => index > 0 && level > levels[index - 1] + 1
    );

    expect(skipped).toEqual([]);
  });

  it('has correct margins', () => {
    const { container } = renderWithNextIntl(<PrivacyPage />);

    expect(container.querySelector('.mt-16')).toBeInTheDocument();
  });
});
