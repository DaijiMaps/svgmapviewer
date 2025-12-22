import type { OsmProperties } from 'svgmapviewer/geo'

export interface ShopInfo {
  tag: 'shop'
  properties: OsmProperties
  title?: string
  name?: string
  address?: string
  website?: string
}
