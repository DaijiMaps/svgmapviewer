import { type Info } from 'svgmapviewer'
import { type OsmProperties } from 'svgmapviewer/geo'

export interface ShopInfo {
  tag: 'shop'
  properties: OsmProperties
  title?: string
  name?: string
  address?: string
  website?: string
}

export interface FacilityInfo {
  tag: 'facility'
  properties: OsmProperties
  title?: string
  name?: string
  address?: string
}

export type XInfo = ShopInfo | FacilityInfo

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

export type { Info }
