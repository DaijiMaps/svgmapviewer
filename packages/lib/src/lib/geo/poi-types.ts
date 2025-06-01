import { type VecVec } from '../vec/prefixed'
import type {
  LineFeature,
  MultiPolygonFeature,
  PointFeature,
} from './geojson-types'
import type {
  OsmLineProperties,
  OsmPointProperties,
  OsmPolygonProperties,
} from './osm-types'

export interface POI {
  id: null | number
  name: string[]
  pos: VecVec
  size: number
  area?: number
}

export type PointsFilter = (
  f: Readonly<PointFeature<OsmPointProperties>>
) => boolean
export type LinesFilter = (
  f: Readonly<LineFeature<OsmLineProperties>>
) => boolean
export type MultiPolygonsFilter = (
  f: Readonly<MultiPolygonFeature<OsmPolygonProperties>>
) => boolean
export type CentroidsFilter = (
  f: Readonly<PointFeature<OsmPolygonProperties>>
) => boolean
export type MidpointsFilter = (
  f: Readonly<PointFeature<OsmLineProperties>>
) => boolean

export interface AllFilters {
  points?: PointsFilter
  lines?: LinesFilter
  multipolygons?: MultiPolygonsFilter
  centroids?: CentroidsFilter
  midpoints?: MidpointsFilter
}
