import { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isLoggedIn } from '@/access/isLoggedIn'
import { SlugField } from '@nouance/payload-better-fields-plugin/Slug'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'name',
    description: 'SPECTRA team members.',
    defaultColumns: ['name', 'title', 'photo', 'profile', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title or position, e.g., Project Manager, etc.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'profile',
      type: 'textarea',
      required: true,
      admin: {
        description:
          "A brief summary of the team member's scientific profile and research interests.",
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the team member.',
      },
    },
    {
      name: 'additionalInfo',
      type: 'textarea',
      admin: {
        description: 'Any other relevant information about the team member.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showOnLandingPage',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            description:
              'Order in which team member appears on landing page (lower numbers appear first)',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      admin: {
        description: "Links to the team member's social profiles or personal website.",
      },
      fields: [
        {
          name: 'platform',
          type: 'relationship',
          relationTo: 'socialPlatforms',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'The full URL to the profile.',
          },
        },
      ],
    },
    {
      name: 'scientificLinks',
      type: 'array',
      admin: {
        description:
          "Links to the team member's scientific profiles like ORCID, Google Scholar, etc.",
      },
      fields: [
        {
          name: 'platform',
          type: 'relationship',
          relationTo: 'scientificPlatforms',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'The full URL to the profile or identifier.',
          },
        },
      ],
    },
    ...SlugField('name'),
  ],
}
