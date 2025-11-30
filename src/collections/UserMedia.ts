import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isLoggedIn } from '@/access/isLoggedIn'

export const UserMedia: CollectionConfig = {
  slug: 'user-media',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: {
    staticDir: 'user-media',
    imageSizes: [
      {
        name: 'avatar',
        width: 100,
        height: 100,
        position: 'centre',
      },
    ],
    adminThumbnail: 'avatar',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for the media, describing its content for accessibility purposes.',
        placeholder: 'e.g., "Profile picture of John Doe"',
      },
    },
  ],
}