import { z } from 'zod'

export function paramsIdExtract(id: unknown) {
  return z.object({ id: z.string() }).parse(id).id
}

export function paramsWhereExtract(id: unknown) {
  return z.object({ where: z.string() }).parse(id).where
}
