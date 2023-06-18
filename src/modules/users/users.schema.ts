import { z } from 'zod'

export const usersLoginBodySchema = z.object({
  login: z.string(),
  password: z.string(),
})

export const usersTokenResponseSchema = z.object({
  token: z.string(),
})

export const usersCreateBodySchema = z.object({
  key: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  login: z.string().min(4).max(12),
  description: z.string().optional(),
})

export type UsersCreateBodyDto = z.infer<typeof usersCreateBodySchema>
export type UsersTokenResponseDto = z.infer<typeof usersTokenResponseSchema>
export type UsersLoginBodyDto = z.infer<typeof usersLoginBodySchema>
