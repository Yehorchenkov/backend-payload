import { Block } from "payload"

export const InlineImage: Block = {
  slug: 'videoYouTube',
    labels: {
        singular: 'YouTube Video',
        plural: 'YouTube Videos',
    },
    fields: [
        {
            name: 'video',
            label: 'YouTube Video Embed URL',
            type: 'text',
            required: true,
        },
        {
            name: 'videoPosition',
            type: 'radio',
            options: ['left', 'center', 'right'],
            defaultValue: 'center',
        },
    ],
}