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
    projectParticipants: true,
    projectLogo: true,
    projectState: true,
    startDate: true,
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
              name: 'projectWebsite',
              label: 'Project Website',
              type: 'text',
              admin: {
                description: 'URL of the project website.',
              },
              validate: (value: unknown) => {
                if (!value) return true
                const urlRegex = /^https?:\/\/.+/i
                return urlRegex.test(value as string)
                  ? true
                  : 'Please enter a valid URL starting with http:// or https://'
              },
            },
            {
              name: 'projectAcknowledgement',
              label: 'Project Acknowledgement',
              type: 'array',
              admin: {
                description: 'List of funding bodies or acknowledgements for the project.',
              },
              fields: [
                {
                  name: 'acknowledgementLogo',
                  label: 'Acknowledgement Logo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'acknowledgementFormula',
                  label: 'Acknowledgement Formula',
                  type: 'text',
                  admin: {
                    description: 'Formula or text for the acknowledgement.',
                  },
                },
              ],
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
              name: 'projectState',
              type: 'select',
              options: [
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Finished', value: 'finished' },
              ],
              defaultValue: 'ongoing',
              required: true,
              admin: {
                description: 'Current state of the project.',
              },
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
            {
              name: 'news',
              type: 'join',
              collection: 'news',
              on: 'project',
              admin: {
                hidden: true,
              },
            },
            ...SlugField('title'),
          ],
        },
      ],
    },
  ],
}
