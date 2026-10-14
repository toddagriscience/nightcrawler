// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import PolicyBody from './components/policy-body';
import PolicyItemHeading from './components/policy-item-heading';
import PolicyList from './components/policy-list';
import PolicySection from './components/policy-section';
import PolicySubheading from './components/policy-subheading';
import TermsPoliciesPage from './terms-policies-page';

describe('TermsPoliciesPage', () => {
  it('renders the title as the page heading', () => {
    render(<TermsPoliciesPage title="Terms of Use">body</TermsPoliciesPage>);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Terms of Use' })
    ).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <TermsPoliciesPage title="Privacy">
        <p>policy body</p>
      </TermsPoliciesPage>
    );

    expect(screen.getByText('policy body')).toBeInTheDocument();
  });

  it('keeps the shared top spacing the three pages rely on', () => {
    const { container } = render(
      <TermsPoliciesPage title="Accessibility">body</TermsPoliciesPage>
    );

    expect(container.querySelector('.pt-8')).toBeInTheDocument();
    expect(container.querySelector('.mt-16')).toBeInTheDocument();
  });

  it('merges extra classes onto the container', () => {
    const { container } = render(
      <TermsPoliciesPage title="Terms" className="custom-class">
        body
      </TermsPoliciesPage>
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('PolicySection', () => {
  it('renders a titled section', () => {
    render(<PolicySection title="Purpose">content</PolicySection>);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Purpose' })
    ).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('omits the heading when no title is given', () => {
    render(<PolicySection>content</PolicySection>);

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});

describe('PolicySubheading', () => {
  it('renders a level three heading', () => {
    render(<PolicySubheading>Rights</PolicySubheading>);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Rights' })
    ).toBeInTheDocument();
  });
});

describe('PolicyItemHeading', () => {
  it('renders a level four heading by default', () => {
    render(<PolicyItemHeading>Identifiers</PolicyItemHeading>);

    expect(
      screen.getByRole('heading', { level: 4, name: 'Identifiers' })
    ).toBeInTheDocument();
  });

  it('renders a level three heading when asked', () => {
    // The level is a prop so entries that hang straight off a section's h2 can
    // sit at h3 without skipping a level, while keeping the prose type scale.
    render(<PolicyItemHeading level={3}>Identifiers</PolicyItemHeading>);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Identifiers' })
    ).toBeInTheDocument();
  });

  it('keeps the prose type scale at either level', () => {
    render(<PolicyItemHeading level={3}>Identifiers</PolicyItemHeading>);

    expect(screen.getByRole('heading', { level: 3 })).toHaveClass(
      'text-[13px]',
      'font-normal'
    );
  });
});

describe('PolicyBody', () => {
  it('renders paragraph text', () => {
    render(<PolicyBody>Some policy prose.</PolicyBody>);

    expect(screen.getByText('Some policy prose.')).toBeInTheDocument();
  });
});

describe('PolicyList', () => {
  it('renders an unordered list by default', () => {
    const { container } = render(<PolicyList items={['first', 'second']} />);

    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an ordered list when asked', () => {
    const { container } = render(<PolicyList items={['first']} ordered />);

    expect(container.querySelector('ol')).toBeInTheDocument();
  });
});
