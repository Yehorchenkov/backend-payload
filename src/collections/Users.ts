import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin';
import { isAdminOrSelf } from '@/access/isAdminOrSelf';
import { anyone } from '@/access/anyone';
import { SlugField } from '@nouance/payload-better-fields-plugin/Slug'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  defaultPopulate: {
    name: true,
    slug: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: '',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      defaultValue: 'editor',
      required: true,
      access: {
        update: isAdminFieldLevel
      },
    },
    ...SlugField('name'),
  ],
  timestamps: true
}
