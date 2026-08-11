// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityForm } from '@/lib/sanity/form-types';
import { getFormBySlug } from '@/lib/sanity/forms';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import type { Mock } from 'vitest';
import { describe, expect, test, vitest } from 'vitest';
import Contact, { metadata } from './page';

vitest.mock('@/lib/sanity/forms', () => ({
  getFormBySlug: vitest.fn(),
}));

vitest.mock(
  '@/app/(unauthenticated)/[locale]/(marketing)/forms/[slug]/components/dynamic-form',
  () => ({
    DynamicForm: ({ form }: { form: SanityForm }) => (
      <div data-testid="dynamic-form">{form.title}</div>
    ),
  })
);

vitest.mock('next/navigation', () => ({
  notFound: vitest.fn(),
}));

/** Published Sanity form returned for the public contact page. */
const contactForm: SanityForm = {
  _id: 'contact-form',
  title: 'Contact our advisory team',
  slug: { current: 'contact' },
  workflowType: 'generic',
  sections: [
    {
      title: 'Contact details',
      fields: [
        {
          name: 'workEmail',
          label: 'Work email',
          type: 'email',
          width: 'half',
          required: true,
        },
      ],
    },
  ],
};

describe('Contact page', () => {
  test('renders the contact Sanity form', async () => {
    (getFormBySlug as Mock).mockResolvedValue(contactForm);

    render(await Contact());

    expect(getFormBySlug).toHaveBeenCalledWith('contact', {
      next: { revalidate: 60 * 60 },
    });
    expect(screen.getByTestId('dynamic-form')).toHaveTextContent(
      'Contact our advisory team'
    );
  });

  test('delegates to notFound when the contact form is missing', async () => {
    (getFormBySlug as Mock).mockResolvedValue(null);

    await Contact();

    expect(notFound).toHaveBeenCalled();
  });

  test('sets contact page metadata', () => {
    expect(metadata).toEqual({ title: 'Contact' });
  });
});
