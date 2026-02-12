// Copyright © Todd Agriscience, Inc. All rights reserved.

// Governance Profiles are a collection of profiles for the team, advisors, and governance structure at Todd Agriscience.

import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'governance-profiles',
  title: 'Governance Profiles',
  description: 'A collection of profiles for the team, advisors, and governance structure at Todd Agriscience.',
  icon: UsersIcon,
  type: 'document',
  fields: [
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
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
      description:
        'Full name of the person. Do not include any titles or suffixes.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'The title of the person. This is typically their official job title.',
    }),
    defineField({
        name: 'profileImage',
        title: 'Profile Image',
        type: 'image',
        description:
          'A professional headshot for the person. This image appears on the governance profiles page. Suggested size: 725x775px.',
        validation: (rule) => rule.required(),
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alt Text',
            description: 'The alt text for the headshot image. This is used for accessibility.',
            validation: (rule) => rule.required(),
          },
        ],
      }),
      defineField({
        name: 'quote',
        title: 'Quote',
        type: 'string',
        description: 'A quote from the person. This is typically their official quote or words of wisdom for their profile page. Please use " " around the quote.',
      }),
    defineField({
      name: 'backstory',
      title: 'Backstory',
      type: 'array',
      description: 'A list of paragraphs for the backstory. This is used to display the backstory of the person.',
      validation: (rule) =>
        rule.custom((value, context) => {
          return Array.isArray(value) && value.length > 0
            ? true
            : 'Backstory is required.'
        }),
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
        name: 'vision',
        title: 'Vision',
        type: 'array',
        description: 'A list of paragraphs for the vision statement of the person. This is used to display the vision of the person.',
        validation: (rule) =>
          rule.custom((value, context) => {
            return Array.isArray(value) && value.length > 0
              ? true
              : 'Vision is required.'
          }),
        of: [
          {
            type: 'block',
          },
        ],
      }),
    defineField({
      name: 'email',
      title: 'Email ',
      type: 'string',
      description: 'The email address of the person. This is used for contact.',
      validation: (rule) => rule.required(),
    }),
  ],
})