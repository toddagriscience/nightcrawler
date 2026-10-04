// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityForm } from '@/lib/sanity/form-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import { DynamicForm } from './dynamic-form';

/** Minimal published form used to assert header copy. */
const form = {
  _id: 'contact-form',
  title: 'CMS title',
  slug: { current: 'contact' },
  description: 'CMS description body',
  workflowType: 'generic',
  sections: [],
} satisfies SanityForm;

describe('DynamicForm', () => {
  it('uses title and subtitle overrides in PageHeader', () => {
    renderWithNextIntl(
      <DynamicForm
        form={form}
        title="Contact our advisory team"
        subtitle="Get started with Todd Iris"
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Contact our advisory team' })
    ).toBeInTheDocument();
    expect(screen.getByText('Get started with Todd Iris')).toBeInTheDocument();
    expect(screen.queryByText('CMS description body')).not.toBeInTheDocument();
  });

  it('renders the CMS title and description when no overrides are passed', () => {
    renderWithNextIntl(<DynamicForm form={form} />);

    expect(
      screen.getByRole('heading', { name: 'CMS title' })
    ).toBeInTheDocument();
    expect(screen.getByText('CMS description body')).toBeInTheDocument();
  });
});
