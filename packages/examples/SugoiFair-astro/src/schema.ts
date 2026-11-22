import { z } from 'astro/zod'

const cafeInfo = z.object({
  tag: z.literal('shop.cafe'),
  nseats: z.number().optional(),
  message: z.string().optional(),
})

const miscInfo = z.object({
  tag: z.literal('shop.misc'),
  message: z.string().optional(),
})

const restaurantInfo = z.object({
  tag: z.literal('shop.restaurant'),
  nseats: z.number().optional(),
  message: z.string().optional(),
})

export const xinfoSchema = z.discriminatedUnion('tag', [
  cafeInfo,
  miscInfo,
  restaurantInfo,
])

export type XInfo = z.Infer<typeof xinfoSchema>
