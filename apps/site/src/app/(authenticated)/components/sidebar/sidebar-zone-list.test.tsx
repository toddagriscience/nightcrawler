// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SidebarZoneList from './sidebar-zone-list';

const navigation = vi.hoisted(() => ({
  pathname: '/',
  query: '',
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.query),
  useRouter: () => ({ push: navigation.push }),
}));

const zones = [
  { id: 90, name: 'Apricot Block', isPending: false },
  { id: 27, name: 'Cherry Block', isPending: true },
];

describe('SidebarZoneList', () => {
  beforeEach(() => {
    navigation.pathname = '/';
    navigation.query = '';
    navigation.push.mockClear();
  });

  it.each([
    ['', 'Cherry Block'],
    ['zone=90', 'Apricot Block'],
    ['zone=999', 'Cherry Block'],
    ['zone=', 'Cherry Block'],
    ['zone=90&zone=27', 'Cherry Block'],
  ])('matches the dashboard selection for query "%s"', (query, name) => {
    navigation.query = query;
    render(<SidebarZoneList zones={zones} defaultZoneId={27} />);

    const links = screen.getAllByRole('link');
    const currentLinks = links.filter(
      (link) => link.getAttribute('aria-current') === 'page'
    );
    expect(currentLinks).toHaveLength(1);
    expect(currentLinks[0]).toHaveTextContent(name);
    expect(currentLinks[0]).toHaveClass('bg-accent/85');
  });

  it.each(['', 'zone=90'])(
    'leaves zone links inactive on other routes with query "%s"',
    (query) => {
      navigation.pathname = '/reminders';
      navigation.query = query;
      render(<SidebarZoneList zones={zones} defaultZoneId={27} />);

      for (const link of screen.getAllByRole('link')) {
        expect(link).not.toHaveAttribute('aria-current');
        expect(link).not.toHaveClass('bg-accent/85');
      }
    }
  );

  it('updates the selected zone when query or pathname changes', () => {
    const { rerender } = render(
      <SidebarZoneList zones={zones} defaultZoneId={27} />
    );
    expect(screen.getByRole('link', { name: /Cherry Block/ })).toHaveAttribute(
      'aria-current',
      'page'
    );

    navigation.query = 'zone=90';
    rerender(<SidebarZoneList zones={zones} defaultZoneId={27} />);
    expect(screen.getByRole('link', { name: /Apricot Block/ })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(
      screen.getByRole('link', { name: /Cherry Block/ })
    ).not.toHaveAttribute('aria-current');

    navigation.pathname = '/reminders';
    rerender(<SidebarZoneList zones={zones} defaultZoneId={27} />);
    expect(
      screen.getByRole('link', { name: /Apricot Block/ })
    ).not.toHaveAttribute('aria-current');
  });

  it('keeps keyboard shortcuts in displayed sidebar order', () => {
    render(<SidebarZoneList zones={zones} defaultZoneId={27} />);

    fireEvent.keyDown(document, { code: 'Digit1', altKey: true });
    expect(navigation.push).toHaveBeenLastCalledWith('/?zone=90');
    fireEvent.keyDown(document, { code: 'Digit2', altKey: true });
    expect(navigation.push).toHaveBeenLastCalledWith('/?zone=27');
  });

  it('renders no zone links for an empty account', () => {
    render(<SidebarZoneList zones={[]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
