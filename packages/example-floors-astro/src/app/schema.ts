import { z } from 'zod'

const cafeInfo = z.object({
  tag: z.literal('shop.cafe'),
  nseats: z.number(),
})

const miscInfo = z.object({
  tag: z.literal('shop.misc'),
  nseats: z.number().optional(),
})

const restaurantInfo = z.object({
  tag: z.literal('shop.restaurant'),
  nseats: z.number().optional(),
})

export const xinfoSchema = z.discriminatedUnion('tag', [
  cafeInfo,
  miscInfo,
  restaurantInfo,
])

export type XInfo = z.Infer<typeof xinfoSchema>
