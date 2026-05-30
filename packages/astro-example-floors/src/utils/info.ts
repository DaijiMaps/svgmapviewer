import { z } from 'zod'

import { baseInfoSchema } from './schema'

export const infoSchema = z.discriminatedUnion('tag', [
  baseInfoSchema.extend({
    tag: z.literal('shop.cafe'),
  }),
  baseInfoSchema.extend({
    tag: z.literal('shop.misc'),
  }),
  baseInfoSchema.extend({
    tag: z.literal('shop.restaurant'),
  }),
  baseInfoSchema.extend({
    tag: z.literal('facility.elevator'),
  }),
  baseInfoSchema.extend({
    tag: z.literal('facility.escalator'),
  }),
  baseInfoSchema.extend({
    tag: z.literal('facility.toilet'),
  }),
])
