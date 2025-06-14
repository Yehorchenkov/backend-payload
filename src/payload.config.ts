// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
import { Tags } from './collections/Tags'
import { Programs } from './collections/Programs'
import { Projects } from './collections/Projects'
import { Pages } from './collections/Pages'

// Blocks
import { ContentWithMedia } from './blocks/ContentWithMedia'
import { InlineImage } from './blocks/InlineImage'
import { ImageGallery } from './blocks/ImageGallery'

// Globals
import { Hero } from './globals/Hero'
import coordinatorsEndpoint from './endpoints/coordinators'
import { Partners } from './globals/Partners'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,

    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, News, Tags, Programs, Projects, Pages],
  globals: [Hero, Partners],
  endpoints: [
    coordinatorsEndpoint,
  ],
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      tabbedUI: true,
      collections: ['pages', 'news', 'projects'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const pageTitle = doc.title // Primary content identifier
        const brandName = 'SPECTRA CE EU'
        const separator = ' | '
        const maxLength = 60

        const baseTitle = `${pageTitle}${separator}${brandName}`

        if (baseTitle.length <= maxLength) {
          return baseTitle
        }

        // Title with brand is too long. Try truncating the pageTitle part.
        const availableLengthForPageTitle = maxLength - brandName.length - separator.length

        // Check if there's enough space for a meaningful title part + ellipsis
        if (availableLengthForPageTitle < 5) {
          // Fallback: Use truncated page title only if it's reasonably long
          let truncatedFallback = pageTitle.substring(0, maxLength - 3) // Reserve space for "..."
          const lastSpaceFallback = truncatedFallback.lastIndexOf(' ')
          if (lastSpaceFallback > Math.floor(maxLength / 2)) {
            // Ensure truncated part isn't too short
            truncatedFallback = truncatedFallback.substring(0, lastSpaceFallback)
          }
          return `${truncatedFallback}...`
        }

        let truncatedPageTitle = pageTitle.substring(0, availableLengthForPageTitle)
        const lastSpaceIndex = truncatedPageTitle.lastIndexOf(' ')

        // Add ellipsis if the original page title was longer than the allocated space
        const ellipsis = pageTitle.length > availableLengthForPageTitle ? '...' : ''

        // Ensure we don't cut words in half for the page title part, only if ellipsis is needed
        if (ellipsis && lastSpaceIndex > 0) {
          truncatedPageTitle = truncatedPageTitle.substring(0, lastSpaceIndex)
        } else if (ellipsis) {
          // If no space found for clean break, hard truncate page title part slightly more to ensure ellipsis fits
          truncatedPageTitle = pageTitle.substring(0, availableLengthForPageTitle - 3)
        }

        return `${truncatedPageTitle}${ellipsis}${separator}${brandName}`
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
