import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { anyone } from '@/access/anyone'

export const SocialPlatforms: CollectionConfig = {
  slug: 'socialPlatforms',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'platformName',
    description: 'Social Platforms',
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