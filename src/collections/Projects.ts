import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isLoggedInOrPublished } from '@/access/isLoggedInOrPublished'
import { SlugField } from '@nouance/payload-better-fields-plugin/Slug'
import type { CollectionBeforeChangeHook } from 'payload'
import { generateExcerpt } from '@/utils/generateExcerpt'

// Hook to generate excerpt before saving
const generateProjectExcerptHook: CollectionBeforeChangeHook = ({ data, /* req, */ operation }) => {
  if (data.content && (operation === 'create' || operation === 'update')) {
    data.excerpt = generateExcerpt(data.content, 500)
  }
  return data
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  hooks: {
    // Add hooks configuration
    beforeChange: [generateProjectExcerptHook],
  },
  access: {
    read: isLoggedInOrPublished,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'acronym',
    description: 'Ongoing and finished projects.',
    group: 'Content',
  },
  defaultPopulate: {
    title: true,
    acronym: true,
    program: true,
    slug: true,
    excerpt: true,
    coordinator: true,
    projectLogo: true,
  },
  defaultSort: ['-publishedDate', 'title'],
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Main content',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'program',
                  type: 'relationship',
                  relationTo: 'programs',
                  hasMany: false,
                  required: true,
                },
                {
                  name: 'coordinator',
                  label: 'Project coordinator',
                  type: 'relationship',
                  relationTo: 'users',
                  hasMany: false,
                },
                {
                  name: 'startDate',
                  label: 'Start date',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                      displayFormat: 'd MMM yyy',
                    },
                  },
                },
                {
                  name: 'finishDate',
                  label: 'Planned or Actual Finish date',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                      displayFormat: 'd MMM yyy',
                    },
                  },
                },
              ],
            },
            {
              name: 'projectLogo',
              label: 'Project logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'acronym',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Details',
          description: 'Additional details',
          fields: [
            {
              name: 'Project state',
              type: 'radio',
              options: ['ongoing', 'finished'],
              defaultValue: 'ongoing',
              required: true,
            },
            {
              // Add the excerpt field
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description:
                  'A short summary of the project article. Automatically generated from content.',
                readOnly: true, // Or true if you ONLY want it auto-generated
              },
            },
            ...SlugField('title'),
          ],
        },
      ],
    },
  ],
}
