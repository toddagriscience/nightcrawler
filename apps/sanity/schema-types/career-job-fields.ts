// Copyright © Todd Agriscience, Inc. All rights reserved.

import {defineField} from 'sanity'

function isVacancy(document: Record<string, unknown> | undefined): boolean {
  const slug = document?.slug as {current?: string} | undefined
  return (
    document?.jobStatus !== 'closed' &&
    document?.jobPostingKind !== 'general-application' &&
    slug?.current !== 'general-application'
  )
}

function isCountry(code: unknown): boolean {
  if (
    typeof code !== 'string' ||
    !/^[A-Z]{2}$/.test(code) ||
    ['ZZ', 'EU', 'UN', 'XA', 'XB', 'QO'].includes(code)
  )
    return false
  const name = new Intl.DisplayNames(['en'], {type: 'region'}).of(code)
  return !!name && name !== code
}

const employmentTypes = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACTOR',
  'TEMPORARY',
  'INTERN',
  'VOLUNTEER',
  'PER_DIEM',
  'OTHER',
]

/** Verified recruiting facts for active, specific vacancies; never inferred from CMS bookkeeping. */
export const careerJobFields = [
  defineField({
    name: 'jobStatus',
    title: 'Posting status',
    type: 'string',
    initialValue: 'open',
    options: {
      list: [
        {title: 'Open', value: 'open'},
        {title: 'Closed', value: 'closed'},
      ],
    },
    validation: (rule) => rule.required(),
    description:
      'Closed postings return 404 and leave public listings, schema and the careers sitemap.',
  }),
  defineField({
    name: 'jobPostingKind',
    title: 'Posting kind',
    type: 'string',
    initialValue: 'vacancy',
    options: {
      list: [
        {title: 'Specific vacancy', value: 'vacancy'},
        {title: 'General application (no JobPosting schema)', value: 'general-application'},
      ],
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'datePosted',
    title: 'Original posting date',
    type: 'datetime',
    description:
      'Recruiting must verify when this role first opened. Do not copy the CMS creation timestamp.',
    validation: (rule) =>
      rule.custom((value, context) =>
        !isVacancy(context.document) || value ? true : 'Verify the original posting date.',
      ),
  }),
  defineField({
    name: 'noExpiry',
    title: 'No scheduled expiry (confirmed)',
    type: 'boolean',
    description: 'Only enable when recruiting confirms the vacancy has no scheduled closing date.',
  }),
  defineField({
    name: 'validThrough',
    title: 'Applications close at',
    type: 'datetime',
    description:
      'The vacancy stops showing active schema/listings at this exact time, without waiting for cache expiry.',
    validation: (rule) =>
      rule.custom((value, context) => {
        if (!isVacancy(context.document)) return true
        if (context.document?.noExpiry === true)
          return value ? 'Choose a deadline or no scheduled expiry, not both.' : true
        if (!value) return 'Provide a deadline or confirm no scheduled expiry.'
        const datePosted = context.document?.datePosted
        return typeof datePosted === 'string' && Date.parse(value) <= Date.parse(datePosted)
          ? 'Closing date must follow the posting date.'
          : true
      }),
  }),
  defineField({
    name: 'employmentTypes',
    title: 'Employment types',
    type: 'array',
    of: [{type: 'string'}],
    options: {list: employmentTypes},
    validation: (rule) =>
      rule.custom((value, context) =>
        !isVacancy(context.document) || value?.length
          ? true
          : 'Choose the verified employment type.',
      ),
  }),
  defineField({
    name: 'workplaceType',
    title: 'Workplace type',
    type: 'string',
    options: {
      list: [
        {title: '100% remote', value: 'remote'},
        {title: 'On site', value: 'onsite'},
        {title: 'Hybrid', value: 'hybrid'},
      ],
    },
    validation: (rule) =>
      rule.custom((value, context) =>
        !isVacancy(context.document) || value ? true : 'Choose the verified workplace type.',
      ),
  }),
  defineField({
    name: 'applicantCountries',
    title: 'Eligible remote applicant countries',
    type: 'array',
    of: [{type: 'string'}],
    description:
      'ISO3166-1 two-letter country codes, e.g. US. Required for fully remote vacancies. These restrictions are displayed to applicants.',
    validation: (rule) =>
      rule.custom((value, context) => {
        if (!isVacancy(context.document) || context.document?.workplaceType !== 'remote')
          return true
        return value?.length && value.every(isCountry)
          ? true
          : 'Confirm eligible countries using uppercase two-letter codes.'
      }),
  }),
  defineField({
    name: 'jobAddress',
    title: 'Workplace address',
    type: 'object',
    fields: [
      defineField({name: 'streetAddress', title: 'Street address', type: 'string'}),
      defineField({
        name: 'addressLocality',
        title: 'City',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({name: 'addressRegion', title: 'State or region', type: 'string'}),
      defineField({name: 'postalCode', title: 'Postal code', type: 'string'}),
      defineField({
        name: 'addressCountry',
        title: 'Country (two-letter code)',
        type: 'string',
        validation: (rule) =>
          rule
            .required()
            .custom((value) =>
              isCountry(value) ? true : 'Choose an actual two-letter country code.',
            ),
      }),
    ],
    validation: (rule) =>
      rule.custom((value, context) =>
        !isVacancy(context.document) || context.document?.workplaceType === 'remote' || value
          ? true
          : 'Confirm the on-site or hybrid workplace address.',
      ),
  }),
  defineField({
    name: 'baseSalary',
    title: 'Verified base compensation',
    type: 'object',
    description:
      'When pay is stated in the body, confirm its currency, exact range and pay period. These values are displayed and reused in schema. Equity remains in the visible description.',
    fields: [
      defineField({
        name: 'currency',
        title: 'Currency (ISO4217)',
        type: 'string',
        validation: (rule) => rule.required().regex(/^[A-Z]{3}$/),
      }),
      defineField({
        name: 'minValue',
        title: 'Minimum',
        type: 'number',
        validation: (rule) => rule.required().min(0),
      }),
      defineField({
        name: 'maxValue',
        title: 'Maximum',
        type: 'number',
        validation: (rule) =>
          rule
            .required()
            .min(0)
            .custom((value, context) => {
              const parent = context.parent as {minValue?: number} | undefined
              return typeof value === 'number' &&
                typeof parent?.minValue === 'number' &&
                value < parent.minValue
                ? 'Maximum must be at least the minimum.'
                : true
            }),
      }),
      defineField({
        name: 'unitText',
        title: 'Pay period',
        type: 'string',
        options: {list: ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']},
        validation: (rule) => rule.required(),
      }),
    ],
  }),
]
