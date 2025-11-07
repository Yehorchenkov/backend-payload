import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { anyone } from '@/access/anyone'

export const ScientificPlatforms: CollectionConfig = {
  slug: 'scientificPlatforms',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'platformName',
    description: 'Scientific Platforms',
    group: 'Tags',
  },
  defaultSort: ['platformName'],
  fields: [
    {
      name: 'platformName',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}