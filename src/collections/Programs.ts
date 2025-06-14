import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { anyone } from '@/access/anyone'
import { SlugField } from '@nouance/payload-better-fields-plugin/Slug'

export const Programs: CollectionConfig = {
  slug: 'programs',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Programs for the projects',
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: ['title'],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    ...SlugField('title'),
  ],
}
