import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isLoggedInOrPublished } from '@/access/isLoggedInOrPublished'
import { SlugField } from '@nouance/payload-better-fields-plugin/Slug'
import type { CollectionBeforeChangeHook } from 'payload'
import { generateExcerpt } from '@/utils/generateExcerpt'

// Hook to generate excerpt before saving
const generateNewsExcerptHook: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (data.content && (operation === 'create' || operation === 'update')) {
    data.excerpt = generateExcerpt(data.content, 150)
  }
  return data
}

export const News: CollectionConfig = {
  slug: 'news',
  hooks: {
    // Add hooks configuration
    beforeChange: [generateNewsExcerptHook],
  },
  access: {
    read: isLoggedInOrPublished,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
    description: 'News articles and updates.',
    group: 'Content',
  },
  defaultSort: ['-updatedAt', 'title'],
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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'project',
                  type: 'relationship',
                  relationTo: 'projects',
                  hasMany: true,
                },
                {
                  name: 'tags',
                  type: 'relationship',
                  relationTo: 'tags',
                  hasMany: true,
                },
              ],
            },
            {
              name: 'title',
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
              // Add the excerpt field
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description:
                  'A short summary of the news article. Automatically generated from content.',
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
