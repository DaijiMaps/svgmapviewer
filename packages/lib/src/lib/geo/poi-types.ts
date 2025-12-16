import { type VecVec } from '../vec/prefixed'
import {
  type OsmLineProperties,
  type OsmPointProperties,
  type OsmPolygonProperties,
} from './osm-types'

export interface POI {
  id: null | number
  name: string[]
  pos: VecVec
  size: number
  area?: number
  fidx?: number
}

export type PointsFilter = (f: Readonly<OsmPointProperties>) => boolean
export type LinesFilter = (f: Readonly<OsmLineProperties>) => boolean
export type MultiPolygonsFilter = (f: Readonly<OsmPolygonProperties>) => boolean
