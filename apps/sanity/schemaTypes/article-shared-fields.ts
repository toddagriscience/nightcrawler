// Copyright © Todd Agriscience, Inc. All rights reserved.

import {defineField} from 'sanity'

/** Body fields reused by `news` and `career` so Portable Text renders identically on the site. */
export const articlePortableBodyFields = [
  defineField({
    name: 'excludeFromSitemap',
    title: 'Exclude from sitemap',
    type: 'boolean',
    initialValue: false,
    description:
      'Internal documents only: when enabled, no XML sitemap entry is generated. External (off-site) documents are always excluded.',
  }),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    validation: (rule) => rule.required(),
    description:
      'Visible title only. Nothing extra (such as “Your title | Todd Agriscience”) is required.',
  }),
  defineField({
    name: 'subtitle',
    title: 'Subtitle',
    type: 'string',
    description: 'Optional subtitle shown below the title on the detail page.',
  }),
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description:
      'Required for public URLs (`/[locale]/index/[slug]`, `/[locale]/careers/[slug]`, etc.).',
    options: {
      source: 'title',
      maxLength: 96,
      isUnique: (value, context) => context.defaultIsUnique(value, context),
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'date',
    title: 'Date',
    type: 'datetime',
    initialValue: () => new Date().toISOString(),
  }),
  defineField({
    name: 'author',
    title: 'Author',
    type: 'string',
    description: 'Author name (if applicable).',
  }),
  defineField({
    name: 'company',
    title: 'Company',
    type: 'string',
    description: 'Company or organization associated with the document (if applicable).',
  }),
  defineField({
    name: 'content',
    title: 'Content',
    type: 'array',
    validation: (rule) =>
      rule.custom((value, context) => {
        const doc = context.document as {offSiteUrl?: string} | undefined
        const isExternal = doc?.offSiteUrl !== undefined
        if (isExternal) return true

        return Array.isArray(value) && value.length > 0
          ? true
          : 'Content is required unless this is an off-site document.'
      }),
    of: [
      {
        type: 'block',
      },
      {
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alt Text',
            validation: (rule) => rule.required(),
          },
        ],
      },
    ],
  }),
  defineField({
    name: 'subscripts',
    title: 'Subscripts',
    type: 'array',
    description:
      'Optional list of subscript entries (footnotes/citations). Add as many as needed and drag to reorder.',
    of: [
      defineField({
        name: 'item',
        title: 'Subscript',
        type: 'object',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'Optional marker such as 1, *, a.',
          }),
          defineField({
            name: 'text',
            title: 'Text',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.required(),
            description: 'The full subscript/footnote text.',
          }),
          defineField({
            name: 'url',
            title: 'Link URL',
            type: 'url',
            description: 'Optional external URL for this subscript entry.',
          }),
        ],
        preview: {
          select: {
            label: 'label',
            text: 'text',
          },
          prepare({label, text}) {
            return {
              title: label ? `[${label}]` : 'Subscript',
              subtitle: text || '',
            }
          },
        },
      }),
    ],
  }),
  defineField({
    name: 'summary',
    title: 'Summary',
    type: 'string',
    validation: (rule) => rule.required(),
    description: 'Short description for SEO and listing cards.',
  }),
  defineField({
    name: 'thumbnail',
    title: 'Thumbnail',
    type: 'image',
    description: 'Image for listing carousels and tables.',
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alt Text',
        validation: (rule) => rule.required(),
      },
    ],
  }),
  defineField({
    name: 'headerImage',
    title: 'Header Image',
    type: 'image',
    description: 'Header image on the detail page; appears above the body content when set.',
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alt Text',
        validation: (rule) => rule.required(),
      },
    ],
  }),
  defineField({
    name: 'offSiteUrl',
    title: 'Off Site Link',
    type: 'url',
    description:
      'When set, legacy `/[locale]/news/[slug]`, `/[locale]/index/[slug]`, and `/[locale]/careers/[slug]` redirect to this URL.',
  }),
  defineField({
    name: 'isFeatured',
    title: 'Featured',
    type: 'boolean',
    description: 'When enabled, may appear in Featured carousels on the matching collection page.',
  }),
  defineField({
    name: 'source',
    title: 'Source',
    type: 'string',
    initialValue: 'Todd',
    description: 'Attribution string; defaults to “Todd” for toddagriscience.com pages.',
  }),
]
