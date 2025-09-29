import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().min(6, 'Phone must be at least 6 digits'),
})
