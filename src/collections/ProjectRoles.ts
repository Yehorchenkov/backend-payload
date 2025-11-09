import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'
import { anyone } from '@/access/anyone'

export const ProjectRoles: CollectionConfig = {
  slug: 'projectRoles',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'roleName',
    description: 'Project Roles',
    group: 'Tags',
  },
  defaultSort: ['roleName'],
  fields: [
    {
      name: 'roleName',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}