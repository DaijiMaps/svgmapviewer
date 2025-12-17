import {
  type OsmLineProperties,
  type OsmPointProperties,
  type OsmPolygonProperties,
} from './osm-types'

export type PointsFilter = (f: Readonly<OsmPointProperties>) => boolean
export type LinesFilter = (f: Readonly<OsmLineProperties>) => boolean
export type MultiPolygonsFilter = (f: Readonly<OsmPolygonProperties>) => boolean
