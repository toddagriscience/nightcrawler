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
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A slug is required for the post to show up in the preview',
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
