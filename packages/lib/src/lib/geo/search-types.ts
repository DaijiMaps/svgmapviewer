import { type Info } from '../../types'
import { type OsmProperties } from './osm-types'

export type POIFilter = (p: OsmProperties) => boolean

export interface OsmSearchEntry {
  filter: (p: OsmProperties) => boolean
  getInfo: (p: OsmProperties, a: string) => Info
}
