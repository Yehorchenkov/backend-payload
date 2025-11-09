import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isLoggedInOrPublished } from '@/access/isLoggedInOrPublished'
import { SlugField } from '@nouance/payload-better-fields-plugin/Slug'
import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'
import { generateExcerpt } from '@/utils/generateExcerpt'
import { ValidationError } from 'payload'

// Hook to generate excerpt before saving
const generateProjectExcerptHook: CollectionBeforeChangeHook = ({ data, /* req, */ operation }) => {
  if (data.content && (operation === 'create' || operation === 'update')) {
    data.excerpt = generateExcerpt(data.content, 500)
  }
  return data
}

const enforceResponsible: CollectionBeforeValidateHook = ({ data }) => {
  const participants = Array.isArray(data?.projectParticipants) ? data.projectParticipants : []

  // At least one participant required
  if (participants.length === 0) {
    throw new ValidationError({
      errors: [
        {
          path: 'projectParticipants',
          message: 'Please add at least one participant to the project.',
        },
      ],
    })
  }

  // Find responsible participants
  const responsibleIndices: number[] = []
  participants.forEach((p, index) => {
    if (p?.isResponsible) {
      responsibleIndices.push(index)
    }
  })

  if (responsibleIndices.length === 0) {
    throw new ValidationError({
      errors: [
        {
          path: 'projectParticipants',
          message: 'Please mark exactly one participant as the responsible person.',
        },
      ],
    })
  }

  if (responsibleIndices.length > 1) {
    // Show error on each responsible checkbox that's checked
    const errors = responsibleIndices.map((index) => ({
      path: `projectParticipants.${index}.isResponsible`,
      message: 'Only one participant can be marked as responsible.',
    }))

    throw new ValidationError({ errors })
  }

  return data
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  hooks: {
    // Add hooks configuration
    beforeChange: [generateProjectExcerptHook],
    beforeValidate: [enforceResponsible],
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
              name: 'projectParticipants',
              label: 'Project Participants',
              type: 'array',
              admin: {
                description: 'List of team members roles',
              },
              fields: [
                {
                  name: 'participantName',
                  type: 'relationship',
                  relationTo: 'team-members',
                  hasMany: false,
                },
                {
                  name: 'participantRole',
                  type: 'relationship',
                  relationTo: 'projectRoles',
                  hasMany: false,
                  admin: {
                    description:
                      'Role of the participant in the project including the responsible person.',
                  },
                },
                {
                  name: 'isResponsible',
                  label: 'Responsible for this project',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
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
