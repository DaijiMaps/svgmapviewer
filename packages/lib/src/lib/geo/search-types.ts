import type { Info } from '../types'
import type { OsmProperties } from './osm-types'

export interface SearchEntry {
  filter: (p: OsmProperties) => boolean
  getInfo: (p: OsmProperties, a: string) => Info
}
