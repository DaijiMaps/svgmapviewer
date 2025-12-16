import { type Info } from 'svgmapviewer'

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

export type { Info }
