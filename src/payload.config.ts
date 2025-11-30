// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor, FixedToolbarFeature, BlocksFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { generateExcerpt } from './utils/generateExcerpt'

// Plugins
import { seoPlugin } from '@payloadcms/plugin-seo'
import { addAuthorsFields } from '@shefing/authors-info'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { NewsTags } from './collections/NewsTags'
import { Programs } from './collections/Programs'
import { Projects } from './collections/Projects'
import { Pages } from './collections/Pages'
import { TeamMembers } from './collections/TeamMembers'

// Blocks
import { ContentWithMedia } from './blocks/ContentWithMedia'
import { InlineImage } from './blocks/InlineImage'
import { ImageGallery } from './blocks/ImageGallery'

// Globals
import { Hero } from './globals/Hero'
import coordinatorsEndpoint from './endpoints/coordinators'
import { Partners } from './collections/Partners'
import { SocialPlatforms } from './collections/SocialPlatforms'
import { ScientificPlatforms } from './collections/ScientificPlatforms'
import { ProjectRoles } from './collections/ProjectRoles'
import { UserMedia } from './collections/UserMedia'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dbClient =
  process.env.DB_CLIENT ?? (process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite')

const db =
  dbClient === 'postgres'
    ? postgresAdapter({
        pool: {
          // use the same DATABASE_URI env var for Postgres
          connectionString: process.env.DATABASE_URI,
        },
      })
    : sqliteAdapter({
        client: {
          // e.g. file:./payload.sqlite (set via env)
          url: process.env.DATABASE_URI || '',
        },
      })

export default buildConfig({
  admin: {
    user: Users.slug,

    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    UserMedia,
    Partners,
    News,
    NewsTags,
    SocialPlatforms,
    ScientificPlatforms,
    ProjectRoles,
    Programs,
    Projects,
    Pages,
    TeamMembers,
  ],
  globals: [Hero],
  endpoints: [coordinatorsEndpoint],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      // Add features array
      ...defaultFeatures,
      FixedToolbarFeature(), // Add the FixedToolbarFeature
      BlocksFeature({
        blocks: [ContentWithMedia, InlineImage, ImageGallery],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // db: sqliteAdapter({
  //   client: {
  //     url: process.env.DATABASE_URI || '',
  //   },
  // }),
  db,
  sharp,
  plugins: [
    seoPlugin({
      tabbedUI: true,
      collections: ['pages', 'news', 'projects'],
      uploadsCollection: 'media',
      generateTitle: ({ doc, collectionSlug }) => {
        const pageTitle = collectionSlug === 'projects' ? doc.acronym : doc.title
        const brandName = 'SPECTRA CE EU'
        const separator = ' | '
        const maxLength = 60
        const ellipsis = '...'

        const baseTitle = `${pageTitle}${separator}${brandName}`

        if (baseTitle.length <= maxLength) {
          return baseTitle
        }

        const brandSuffix = `${separator}${brandName}`
        const availableLengthForPageTitle = maxLength - brandSuffix.length - ellipsis.length

        // Not enough space for meaningful title with brand
        if (availableLengthForPageTitle < 5) {
          const maxTitleLength = maxLength - ellipsis.length
          let truncated = pageTitle.substring(0, maxTitleLength)
          const lastSpace = truncated.lastIndexOf(' ')
          if (lastSpace > Math.floor(maxTitleLength / 2)) {
            truncated = truncated.substring(0, lastSpace)
          }
          return `${truncated}${ellipsis}`
        }

        let truncatedPageTitle = pageTitle.substring(0, availableLengthForPageTitle)
        const lastSpaceIndex = truncatedPageTitle.lastIndexOf(' ')

        if (lastSpaceIndex > 0) {
          truncatedPageTitle = truncatedPageTitle.substring(0, lastSpaceIndex)
        }

        return `${truncatedPageTitle}${ellipsis}${brandSuffix}`
      },
      generateDescription: ({ doc }) => generateExcerpt(doc.content, 150),
      generateURL: ({ doc, collectionSlug }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        return `${baseUrl}/${collectionSlug}/${doc.slug}/`
      },
    }),
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    addAuthorsFields({
      excludedCollections: ['users'], //array of collections names to exclude
      excludedGlobals: [], // array of globals names to exclude
      usernameField: 'name', //name field to use from Users collection, 'user' by default
    }),
  ],
})
