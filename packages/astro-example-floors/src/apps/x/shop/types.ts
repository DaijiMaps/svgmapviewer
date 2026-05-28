import type { Book } from './book/types'
import type { Restaurant } from './restaurant/types'

export type ShopKind = Book | Restaurant

export interface ShopInfo {
  tag: 'shop'
  kind: ShopKind
}
