import type { OsmProperties } from 'svgmapviewer/geo'

export interface FacilityInfo {
  tag: 'facility'
  properties: OsmProperties
  title?: string
  name?: string
  address?: string
}
