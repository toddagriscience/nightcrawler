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
        'Full name of the person. Nothing extra. This is required.',
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
          'A professional headshot for the person. This image appears on the governance profiles page. Suggested size: 400x400px.',
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
        description: 'A quote from the person. This is typically their official quote or words of wisdom for their profile page. Please use " " around the quote. If no quote is provided, only the bio will be displayed instead.',
      }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description: 'A list of paragraphs for the bio. This is used to display the bio of the person.',
      validation: (rule) =>
        rule.custom((value, context) => {
          return Array.isArray(value) && value.length > 0
            ? true
            : 'Bio is required.'
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
      description: 'The email address and social media links of the person. This is used for contact.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'socialMediaLinks',
      title: 'X and LinkedIn Links',
      type: 'array',
      description: 'The X and LinkedIn links of the person. This is used for contact.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'x',
              title: 'X Profile Link',
              type: 'url',
              description: 'The URL of the person\'s X profile.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'linkedin',
              title: 'LinkedIn Profile Link',
              type: 'url',
              description: 'The URL of the person\'s LinkedIn profile.',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
})