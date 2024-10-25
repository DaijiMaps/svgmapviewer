import type { MapData } from './data'
import { calcScale } from './geojson'
import type {
  LineCoordinate,
  LineFeature,
  LineGeoJSON,
  LineGeometry,
  MultiLineCoordinate,
  MultiLineFeature,
  MultiLineGeoJSON,
  MultiLineGeometry,
  MultiPointCoordinate,
  MultiPointFeature,
  MultiPointGeoJSON,
  MultiPointGeometry,
  MultiPolygonCoordinate,
  MultiPolygonFeature,
  MultiPolygonGeoJSON,
  MultiPolygonGeometry,
  PointCoordinate,
  PointFeature,
  PointGeoJSON,
  PointGeometry,
  PolygonCoordinate,
  PolygonFeature,
  PolygonGeoJSON,
  PolygonGeometry,
} from './geojson-types'
import type {
  OsmLineProperties,
  OsmLineStringProperties,
  OsmPointProperties,
  OsmPolygonProperties,
} from './osm-types'
import type { Line, MultiLineString, MultiPolygon, Point } from './path'
import { lineToPath, multiLineStringToPath, multiPolygonToPath } from './path'
import { POI } from './poi'

export type {
  Line,
  LineCoordinate,
  LineFeature,
  LineGeoJSON,
  LineGeometry,
  MapData,
  MultiLineCoordinate,
  MultiLineFeature,
  MultiLineGeoJSON,
  MultiLineGeometry,
  MultiLineString,
  MultiPointCoordinate,
  MultiPointFeature,
  MultiPointGeoJSON,
  MultiPointGeometry,
  MultiPolygon,
  MultiPolygonCoordinate,
  MultiPolygonFeature,
  MultiPolygonGeoJSON,
  MultiPolygonGeometry,
  OsmLineProperties,
  OsmLineStringProperties,
  OsmPointProperties,
  OsmPolygonProperties,
  Point,
  PointCoordinate,
  PointFeature,
  PointGeoJSON,
  PointGeometry,
  PolygonCoordinate,
  PolygonFeature,
  PolygonGeoJSON,
  PolygonGeometry,
}

export { calcScale, lineToPath, multiLineStringToPath, multiPolygonToPath }

export type { POI }

//// filter types

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

export interface AllFilters {
  points?: PointsFilter
  lines?: LinesFilter
  multipolygons?: MultiPolygonsFilter
  centroids?: CentroidsFilter
}