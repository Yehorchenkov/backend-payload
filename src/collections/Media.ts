import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isLoggedIn } from '@/access/isLoggedIn'
import AltTextInstructions from '@/components/AltTextInstructions'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text (Alternative Text) for images or description for other files',
      type: 'text',
      required: false,
      admin: {
        // @ts-ignore
        description: AltTextInstructions,
        placeholder: 'e.g., "Attendees networking at the Annual Conference" or "Speaker presenting on stage"',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    // mimeTypes: ['image/*', 'application/pdf'],
  },
}
