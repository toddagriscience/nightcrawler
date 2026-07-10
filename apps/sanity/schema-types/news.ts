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
      initialValue: 'news-company',
      options: {
        // Titles are namespaced (`Research · …` / `News · …`) so the research and
        // news taxonomies stay distinguishable in Studio — several labels
        // (Publication, Milestone, Release) otherwise collide. The stored `value`
        // is already namespaced, so titles are display-only (no data impact).
        list: [
          {title: 'Research · Publication', value: 'research-publication'},
          {title: 'Research · Conclusion', value: 'research-conclusion'},
          {title: 'Research · Milestone', value: 'research-milestone'},
          {title: 'Research · Release', value: 'research-release'},
          {title: 'News · Publication', value: 'news-publication'},
          {title: 'News · Milestone', value: 'news-milestone'},
          {title: 'News · Release', value: 'news-release'},
          {title: 'News · Company', value: 'news-company'},
          {title: 'News · Research', value: 'news-research'},
          {title: 'News · Global affairs', value: 'news-global-affairs'},
        ],
        layout: 'radio',
      },
      description:
        'Primary category for routing and parent pages (newsroom, research, stories, etc.). Defaults to news for older posts. Job postings use the Careers document type.',
    }),
    defineField({
      name: 'collections',
      title: 'Additional collections',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Research · Publication', value: 'research-publication'},
          {title: 'Research · Conclusion', value: 'research-conclusion'},
          {title: 'Research · Milestone', value: 'research-milestone'},
          {title: 'Research · Release', value: 'research-release'},
          {title: 'News · Publication', value: 'news-publication'},
          {title: 'News · Milestone', value: 'news-milestone'},
          {title: 'News · Release', value: 'news-release'},
          {title: 'News · Company', value: 'news-company'},
          {title: 'News · Research', value: 'news-research'},
          {title: 'News · Global affairs', value: 'news-global-affairs'},
        ],
        layout: 'tags',
      },
      description:
        'Extra groupings when an article spans more than one parent page. Job postings use the Careers document type.',
    }),
    defineField({
      name: 'canonicalParent',
      title: 'Canonical parent (optional)',
      type: 'string',
      options: {
        list: [
          {title: 'Research · Publication', value: 'research-publication'},
          {title: 'Research · Conclusion', value: 'research-conclusion'},
          {title: 'Research · Milestone', value: 'research-milestone'},
          {title: 'Research · Release', value: 'research-release'},
          {title: 'News · Publication', value: 'news-publication'},
          {title: 'News · Milestone', value: 'news-milestone'},
          {title: 'News · Release', value: 'news-release'},
          {title: 'News · Company', value: 'news-company'},
          {title: 'News · Research', value: 'news-research'},
          {title: 'News · Global affairs', value: 'news-global-affairs'},
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
