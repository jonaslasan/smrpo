import { z } from 'zod'

export const projectRoleValidator = z.enum([
  'scrum_master',
  'scrum_master_developer',
  'product_owner',
  'product_owner_scrum_master',
  'developer',
])
