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
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Email address of the team member.',
      },
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        description: "Links to the team member's social profiles or personal website.",
      },
      fields: [
        {
          name: 'label',
          type: 'select',
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X', value: 'X' },
            { label: 'GitHub', value: 'github' },
            { label: 'Personal Website', value: 'website' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'showOnLandingPage',
      type: 'checkbox',
      defaultValue: true,
    },
    ...SlugField('name'),
  ],
}
