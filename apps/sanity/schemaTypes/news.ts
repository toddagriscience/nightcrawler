// Copyright © Todd Agriscience, Inc. All rights reserved.

import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

import {articlePortableBodyFields} from './article-shared-fields'

/** Newsroom + research/etc. Articles. Job postings use the `Career` document type instead. */
export default defineType({
  name: 'news',
  title: 'Article',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'contentType',
      title: 'Content type',
      type: 'string',
      initialValue: 'news',
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Research', value: 'research'},
          {title: 'Story', value: 'story'},
          {title: 'Product release', value: 'product-release'},
          {title: 'Press', value: 'press'},
        ],
        layout: 'radio',
      },
      description:
        'Primary category for routing and parent pages (newsroom, research, stories, etc.). Defaults to news for older posts. Use Careers documents for jobs.',
    }),
    defineField({
      name: 'collections',
      title: 'Additional collections',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Research', value: 'research'},
          {title: 'Story', value: 'story'},
          {title: 'Product release', value: 'product-release'},
          {title: 'Press', value: 'press'},
        ],
        layout: 'tags',
      },
      description:
        'Extra groupings when an article spans more than one parent page. Prefer the Careers document type for `/careers` content.',
    }),
    defineField({
      name: 'canonicalParent',
      title: 'Canonical parent (optional)',
      type: 'string',
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Research', value: 'research'},
          {title: 'Story', value: 'story'},
          {title: 'Product release', value: 'product-release'},
          {title: 'Press', value: 'press'},
        ],
      },
      description:
        'Preferred parent for breadcrumbs or analytics when an article spans multiple collections.',
    }),
    ...articlePortableBodyFields,
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

      return {title: title ?? 'Untitled', subtitle: parts.join(' · ')}
    },
  },
})
