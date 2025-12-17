import { type Info } from 'svgmapviewer'
import { type POI } from 'svgmapviewer/geo'

export interface Toilet {
  tag: 'toilet'
}
export interface Stairs {
  tag: 'stairs'
}

export type FacilityKind = Toilet | Stairs

export interface ShopInfo {
  tag: 'shop'
}

export interface FacilityInfo {
  tag: 'facility'
  kind: FacilityKind
}

export type XInfo = ShopInfo | FacilityInfo

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

declare module 'svgmapviewer/geo' {
  interface POI {
    x: XInfo
  }
}

export { type Info, type POI }
