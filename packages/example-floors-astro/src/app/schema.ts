import { z } from 'zod'

const cafeInfo = z.object({
  tag: z.literal('shop.cafe'),
})

const restaurantInfo = z.object({
  tag: z.literal('shop.restaurant'),
})

export const xinfoSchema = z.discriminatedUnion('tag', [
  cafeInfo,
  restaurantInfo,
])

export type CafeInfo = z.Infer<typeof cafeInfo>
export type RestaurantInfo = z.Infer<typeof restaurantInfo>
export type XInfo = z.Infer<typeof xinfoSchema>
