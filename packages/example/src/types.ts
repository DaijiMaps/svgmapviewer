import { type Info } from 'svgmapviewer'
import { type POI } from 'svgmapviewer/geo'

export interface ShopInfo {
  tag: 'shop'
}

export interface FacilityInfo {
  tag: 'facility'
}

export type XInfo = ShopInfo | FacilityInfo

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

declare module 'svgmapviewer/geo' {
  interface POI {
    fidx: number
  }
}

export { type Info, type POI }
