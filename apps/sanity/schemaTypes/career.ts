// Copyright © Todd Agriscience, Inc. All rights reserved.

import {CaseIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

import {articlePortableBodyFields} from './article-shared-fields'

/**
 * Job postings and other careers pages; same public URL shape as `news` (`/[locale]/index/[slug]`).
 *
 * Kept as a separate `_type` so editors get a dedicated Studio list as volume grows.
 */
export default defineType({
  name: 'career',
  title: 'Careers',
  icon: CaseIcon,
  type: 'document',
  fields: [
    ...articlePortableBodyFields,
    defineField({
      name: 'jobLocation',
      title: 'Location',
      type: 'string',
      description: 'City, region, hybrid note, or “Remote” — shown on the public careers listing.',
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

      return {
        title: title ?? 'Untitled',
        subtitle: parts.join(' · '),
      }
    },
  },
})
