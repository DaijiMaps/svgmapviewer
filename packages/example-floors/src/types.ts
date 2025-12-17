import { type Info, type POI } from 'svgmapviewer'

//// ShopKind

export interface Restaurant {
  tag: 'restaurant'
}

export interface Book {
  tag: 'book'
}

export type ShopKind = Book | Restaurant

//// FacilityKind

export interface Toilet {
  tag: 'toilet'
}
export interface Stairs {
  tag: 'stairs'
}

export type FacilityKind = Toilet | Stairs

//// XInfo

export interface ShopInfo {
  tag: 'shop'
  kind: ShopKind
}

export interface FacilityInfo {
  tag: 'facility'
  kind: FacilityKind
}

export type XInfo = ShopInfo | FacilityInfo

////

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
  interface POI {
    x: XInfo
  }
}

export { type Info, type POI }
