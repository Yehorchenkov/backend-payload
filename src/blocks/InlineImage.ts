import { Block } from "payload"

export const InlineImage: Block = {
  slug: 'inlineImage',
    labels: {
        singular: 'Inline Image',
        plural: 'Inline Images',
    },
    fields: [
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'imagePosition',
            type: 'radio',
            options: ['left', 'right'],
            defaultValue: 'left',
        },
        {
            name: 'imageWidth',
            type: 'radio',
            options: [
                {
                    label: '25% (for icons)',
                    value: '1/4',
                },
                {
                    label: '33%',
                    value: '1/3',
                },
                {
                    label: '50%',
                    value: '1/2',
                },
                {
                    label: '66%',
                    value: '2/3',
                },
                {
                    label: '100%',
                    value: 'full',
                },
            ],
            defaultValue: '33%',
        }
    ],
}