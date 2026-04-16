// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HowToUseWordmark from './how-to-use-wordmark';

const doText = {
  count: '2',
  '0': 'First do item.',
  '1': 'Second do item.',
} as const;

const dontText = {
  count: '1',
  '0': 'Only don’t item.',
} as const;

describe('HowToUseWordmark', () => {
  it('renders section with accessible title and main heading', () => {
    render(
      <HowToUseWordmark
        title="How to use our Wordmark"
        doHeading="Do:"
        doText={{ ...doText }}
        dontHeading="Don't:"
        dontText={{ ...dontText }}
      />
    );

    const region = screen.getByRole('region', {
      name: 'How to use our Wordmark',
    });
    expect(region).toHaveAttribute(
      'aria-labelledby',
      'how-to-use-wordmark-heading'
    );

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'How to use our Wordmark',
      })
    ).toHaveAttribute('id', 'how-to-use-wordmark-heading');
  });

  it('renders do and don’t column headings and list items', () => {
    render(
      <HowToUseWordmark
        title="Section"
        doHeading="Do:"
        doText={{ ...doText }}
        dontHeading="Don't:"
        dontText={{ ...dontText }}
      />
    );

    expect(
      screen.getByRole('heading', { level: 4, name: 'Do:' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: "Don't:" })
    ).toBeInTheDocument();

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2);

    const doListItems = within(lists[0]).getAllByRole('listitem');
    expect(doListItems).toHaveLength(2);
    expect(doListItems[0]).toHaveTextContent('First do item.');
    expect(doListItems[1]).toHaveTextContent('Second do item.');

    const dontListItems = within(lists[1]).getAllByRole('listitem');
    expect(dontListItems).toHaveLength(1);
    expect(dontListItems[0]).toHaveTextContent('Only don’t item.');
  });

  it('omits lists when doText or dontText yield no items', () => {
    const { container, rerender } = render(
      <HowToUseWordmark
        title="Section"
        doHeading="Do:"
        doText={undefined}
        dontHeading="Don't:"
        dontText={{ ...dontText }}
      />
    );

    expect(screen.queryAllByRole('list')).toHaveLength(1);

    rerender(
      <HowToUseWordmark
        title="Section"
        doHeading="Do:"
        doText={{ ...doText }}
        dontHeading="Don't:"
        dontText={undefined}
      />
    );

    expect(screen.queryAllByRole('list')).toHaveLength(1);

    rerender(
      <HowToUseWordmark
        title="Section"
        doHeading="Do:"
        doText={undefined}
        dontHeading="Don't:"
        dontText={undefined}
      />
    );

    expect(container.querySelector('ul')).not.toBeInTheDocument();
  });
});
