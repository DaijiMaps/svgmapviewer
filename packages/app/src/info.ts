import { Info } from '@daijimaps/svgmapviewer'
import { OsmProperties } from '@daijimaps/svgmapviewer/geo'

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

declare module '@daijimaps/svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

export type { Info }
