import { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export const isAdmin: Access<User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  if (user) {
    return Boolean(user?.role === 'admin')
  }
  return false
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  if (user) {
    return Boolean(user?.role === 'admin')
  }
  return false
}