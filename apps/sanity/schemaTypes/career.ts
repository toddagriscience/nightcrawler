// Copyright © Todd Agriscience, Inc. All rights reserved.

import {CaseIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {careerArticleLeadFields, careerArticleTrailFields} from './article-shared-fields'

/**
 * Job postings for `/[locale]/careers/[slug]`; separate `_type` for a dedicated Studio list and a slimmer field set than `news`.
 *
 * Does not use thumbnails, header image, featured flag, subscripts, redirect URL, source, summary, company/author/subtitle/date (`news` / article template only).
 */
export default defineType({
  name: 'career',
  title: 'Careers',
  icon: CaseIcon,
  type: 'document',
  fields: [
    ...careerArticleLeadFields,
    defineField({
      name: 'jobTeam',
      title: 'Team',
      type: 'string',
      description:
        'Department or role family (e.g. Software Engineer). Shown with location on listings and the posting hero.',
    }),
    defineField({
      name: 'jobLocation',
      title: 'Location',
      type: 'string',
      description:
        'City, region, hybrid note, or “Remote” — shown on listings and job detail hero.',
    }),
    defineField({
      name: 'applyUrl',
      title: 'Apply URL',
      type: 'url',
      description:
        'Every “Apply now” control on the public posting opens this URL (external ATS, email `mailto:`, etc.).',
      validation: (rule) =>
        rule.custom((url) => {
          const u = url !== undefined && url !== null && url !== '' ? String(url).trim() : ''
          return u !== '' ? true : 'Apply URL is required.'
        }),
    }),
    ...careerArticleTrailFields,
  ],
  preview: {
    select: {
      title: 'title',
      jobTeam: 'jobTeam',
      jobLocation: 'jobLocation',
    },
    prepare({title, jobTeam, jobLocation}) {
      const bits = [jobTeam, jobLocation].filter(
        (s): s is string => typeof s === 'string' && s.trim() !== '',
      )
      return {
        title: title ?? 'Untitled',
        subtitle: bits.length > 0 ? bits.join(' · ') : undefined,
      }
    },
  },
})
