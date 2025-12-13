// Copyright Todd Agriscience, Inc. All rights reserved.
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
      name: 'content',
      title: 'Content',
      type: 'array',
      validation: (rule) => rule.required(),
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
      date: 'date',
    },
    prepare({title, date}) {
      const subtitles = [date && `on ${format(parseISO(date), 'LLL d, yyyy')}`].filter(Boolean)

      return {title, subtitle: subtitles.join(' ')}
    },
  },
})
