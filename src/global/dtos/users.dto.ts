import { z } from 'zod'

export const usersResponseSchema = z.object({
  id: z.string().uuid(),
  key: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  login: z.string(),
  avatar_url: z.string().nullable(),
  description: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
})

export type UsersResponseDto = z.infer<typeof usersResponseSchema>
