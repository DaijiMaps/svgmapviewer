import { z } from 'zod'

export const xinfoSchema = z.discriminatedUnion('tag', [
  z.object({
    tag: z.literal('shop.cafe'),
  }),
  z.object({
    tag: z.literal('shop.restaurant'),
  }),
  /*
  z.object({
    tag: z.literal('shop.misc'),
  }),
  z.object({
    tag: z.literal('facility.elevator'),
  }),
  z.object({
    tag: z.literal('facility.escalator'),
  }),
  z.object({
    tag: z.literal('facility.toilet'),
  }),
  */
])
