// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AccountInfo from './account-info';

describe('AccountInfo', () => {
  it('renders a back link to the parent route when backHref is set', () => {
    render(
      <AccountInfo title="Privacy" backHref="/account">
        <p>content</p>
      </AccountInfo>
    );

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/account'
    );
  });

  it('omits the back link when backHref is not set', () => {
    render(
      <AccountInfo title="Account">
        <p>content</p>
      </AccountInfo>
    );

    expect(
      screen.queryByRole('link', { name: 'Back' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('uses a custom backLabel when provided', () => {
    render(
      <AccountInfo
        title="Zone detail"
        backHref="/account/management-zones"
        backLabel="Management zones"
      >
        <p>content</p>
      </AccountInfo>
    );

    expect(
      screen.getByRole('link', { name: 'Management zones' })
    ).toHaveAttribute('href', '/account/management-zones');
    expect(
      screen.queryByRole('link', { name: 'Back' })
    ).not.toBeInTheDocument();
  });

  it('falls back to the default label when backLabel is blank', () => {
    render(
      <AccountInfo title="Privacy" backHref="/account" backLabel="   ">
        <p>content</p>
      </AccountInfo>
    );

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/account'
    );
  });

  it('renders the title and optional description', () => {
    render(
      <AccountInfo title="Security" description="Keep your account secure.">
        <p>content</p>
      </AccountInfo>
    );

    expect(
      screen.getByRole('heading', { name: 'Security', level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByText('Keep your account secure.')).toBeInTheDocument();
  });
});
