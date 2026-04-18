// Copyright © Todd Agriscience, Inc. All rights reserved.

import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'news',
  title: 'News Article',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description:
        'Only the title of the article. Nothing extra (such as `Your title here | Todd Agriscience`) is required.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional subtitle shown below the title on the article page.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A slug is required for the post to be accessible from `toddagriscience.com`',
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
      description: 'Company or organization associated with the article (if applicable).',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as {offSiteUrl?: string} | undefined

          // If this is an off-site/external article, allow empty content.
          // Otherwise, require content.
          const isExternal = doc?.offSiteUrl !== undefined

          if (isExternal) return true

          return Array.isArray(value) && value.length > 0
            ? true
            : 'Content is required unless this is an off-site article.'
        }),
      of: [
        {
          type: 'block',
        },
        {
          type: 'image', // images
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
      description: 'A brief description of the article. Used for SEO.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description:
        'A thumbnail for the article on the `/en/news` page. Not currently used for SEO.',
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
      description:
        'A header image for the article detail page. This image appears above the body content.',
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
        'If a URL is present in this field, no news page will exist for this article. Specifically, navigating to a URL such as `/en/news/{your-slug}` will redirect to this URL.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured articles are displayed on the featured section of `/en/news`.',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      initialValue: 'Todd',
      description:
        'The source of the article. Defaults to "Todd" for articles listed on `toddagriscience.com`.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'date',
      authorName: 'author',
    },
    prepare({title, publishedAt, authorName}) {
      const parts = [
        authorName && `by ${authorName}`,
        publishedAt && `on ${format(parseISO(publishedAt), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return {title, subtitle: parts.join(' · ')}
    },
  },
})
