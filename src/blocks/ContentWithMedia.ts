import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ContentWithMedia: Block = {
    slug: 'contentWithMedia',
    labels: {
        singular: 'Content with Media Block',
        plural: 'Content with Media Blocks',
    },
    fields: [
        {
            name: 'content',
            type: 'richText',
            required: true,
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                ],
              }),
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'textPosition',
            type: 'radio',
            options: ['left', 'right'],
            defaultValue: 'left',
        }
    ],
}