import { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isLoggedIn } from '@/access/isLoggedIn'

import countriesData from '@/data/countries.json'
const countryOptions = countriesData
  .filter((country) => country.country) // Ensure country.name is defined
  .map((country) => ({
    label: country.country as string,
    value: country.abbreviation as string,
  }))

export const Partners: GlobalConfig = {
  slug: 'partners',
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
        name: 'website',
        type: 'text',
        admin: {
          description: 'Website URL of the partner organization.',
        },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'country',
      type: 'select',
      options: countryOptions,
    },
  ],
}
