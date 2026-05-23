// Copyright © Todd Agriscience, Inc. All rights reserved.

import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Whitelisted public form field types rendered by `/forms/[slug]`. */
const FORM_FIELD_TYPES = [
  {title: 'Text', value: 'text'},
  {title: 'Email', value: 'email'},
  {title: 'Phone', value: 'phone'},
  {title: 'Textarea', value: 'textarea'},
  {title: 'URL', value: 'url'},
  {title: 'Select', value: 'select'},
  {title: 'Yes / No', value: 'yesNo'},
  {title: 'Checkbox', value: 'checkbox'},
] as const

/** Shared CMS field row used inside form sections. */
const formFieldMember = defineArrayMember({
  name: 'formField',
  title: 'Field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Field name (key)',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Use camelCase without spaces (e.g. firstName).'),
      description: 'Stable key stored in Postgres answers JSON.',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [...FORM_FIELD_TYPES],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full width', value: 'full'},
          {title: 'Half width', value: 'half'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
    }),
    defineField({
      name: 'helpText',
      title: 'Help text',
      type: 'string',
    }),
    defineField({
      name: 'options',
      title: 'Select options',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({parent}) => parent?.type !== 'select',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {type?: string} | undefined
          if (parent?.type !== 'select') return true
          return Array.isArray(value) && value.length > 0
            ? true
            : 'Add at least one option for select fields.'
        }),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'type',
      name: 'name',
      width: 'width',
    },
    prepare({title, subtitle, name, width}) {
      const widthLabel = width === 'half' ? 'half width' : 'full width'
      return {
        title: title || name || 'Field',
        subtitle: subtitle ? `${subtitle} · ${widthLabel}` : widthLabel,
      }
    },
  },
})

/**
 * CMS-defined marketing/access request form rendered at `/forms/[slug]`.
 * Submissions are stored in Postgres, not Sanity.
 */
export default defineType({
  name: 'form',
  title: 'Form',
  icon: DocumentIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Page heading shown above the form.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      description: 'Public URL: /forms/[slug].',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional intro copy below the title.',
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Submit request',
    }),
    defineField({
      name: 'successTitle',
      title: 'Success title',
      type: 'string',
      initialValue: 'Request received',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'text',
      rows: 3,
      initialValue: 'Thank you. Our team will review your request and follow up by email.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          name: 'formSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Section description',
              type: 'text',
              rows: 2,
              description: 'Optional helper copy shown below the section title.',
            }),
            defineField({
              name: 'fields',
              title: 'Fields',
              type: 'array',
              validation: (rule) => rule.min(1),
              of: [formFieldMember],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              fieldCount: 'fields',
            },
            prepare({title, fieldCount}) {
              const count = Array.isArray(fieldCount) ? fieldCount.length : 0
              return {
                title: title || 'Section',
                subtitle: `${count} field${count === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerCheckboxes',
      title: 'Footer checkboxes',
      type: 'array',
      description:
        'Optional consent checkboxes shown after sections. Use field name `retentionConsent` to control data retention on rejection.',
      of: [
        defineArrayMember({
          name: 'formFooterCheckbox',
          title: 'Footer checkbox',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Field name (key)',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .regex(
                    /^[a-zA-Z][a-zA-Z0-9_]*$/,
                    'Use camelCase without spaces (e.g. retentionConsent).',
                  ),
              description: 'Stable key stored with the submission.',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'helpText',
              title: 'Help text',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              name: 'name',
              required: 'required',
            },
            prepare({title, name, required}) {
              return {
                title: title || name || 'Footer checkbox',
                subtitle: required ? `${name} · required` : name,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      type: 'text',
      rows: 4,
      description:
        'Optional disclosure copy shown at the bottom of the form, after footer checkboxes and before submit.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title || 'Form',
        subtitle: slug ? `/forms/${slug}` : 'Missing slug',
      }
    },
  },
})
