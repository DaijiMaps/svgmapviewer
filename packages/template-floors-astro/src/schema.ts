import { z } from 'zod'

export const xinfoSchema = z.discriminatedUnion('tag', [])

export type XInfo = z.Infer<typeof xinfoSchema>
