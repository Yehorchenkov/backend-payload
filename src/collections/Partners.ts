import { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isLoggedIn } from '@/access/isLoggedIn'

import countriesData from '@/data/countries.json'
const countryOptions = countriesData
  .filter((country) => country.country) // Ensure country.country is defined
  .map((country) => ({
    label: country.country as string,
    value: country.abbreviation as string,
  }))

export const Partners: CollectionConfig = {
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
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'lat',
          label: 'Latitude',
          type: 'number',
          required: true,
        },
        {
          name: 'lon',
          label: 'Longitude',
          type: 'number',
          required: true,
        },
      ]
    },
  ],
}
