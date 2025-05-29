import {
  type MapData,
  type OsmPointLikeFeature,
  type OsmPointLikeGeoJSON,
  type OsmPointLikeProperties,
} from './data'
import { calcScale } from './geojson'
import {
  type LineCoordinate,
  type LineFeature,
  type LineGeoJSON,
  type LineGeometry,
  type MultiLineCoordinate,
  type MultiLineFeature,
  type MultiLineGeoJSON,
  type MultiLineGeometry,
  type MultiPointCoordinate,
  type MultiPointFeature,
  type MultiPointGeoJSON,
  type MultiPointGeometry,
  type MultiPolygonCoordinate,
  type MultiPolygonFeature,
  type MultiPolygonGeoJSON,
  type MultiPolygonGeometry,
  type PointCoordinate,
  type PointFeature,
  type PointGeoJSON,
  type PointGeometry,
  type PolygonCoordinate,
  type PolygonFeature,
  type PolygonGeoJSON,
  type PolygonGeometry,
} from './geojson-types'
import {
  type OsmLineProperties,
  type OsmLineStringProperties,
  type OsmPointProperties,
  type OsmPolygonProperties,
} from './osm-types'
import {
  lineToPath,
  multiLineStringToPath,
  multiPolygonToPath,
  type Line,
  type MultiLineString,
  type MultiPolygon,
  type Point,
} from './path'
import { type POI } from './poi'
import {
  geolocActorStart,
  geolocRequest,
  useGeolocPosition,
} from './position-xstate'
import {
  findFeature,
  findProperties,
  getOsmId,
  getPropertyValue,
} from './search'

export {
  type Line,
  type LineCoordinate,
  type LineFeature,
  type LineGeoJSON,
  type LineGeometry,
  type MapData,
  type MultiLineCoordinate,
  type MultiLineFeature,
  type MultiLineGeoJSON,
  type MultiLineGeometry,
  type MultiLineString,
  type MultiPointCoordinate,
  type MultiPointFeature,
  type MultiPointGeoJSON,
  type MultiPointGeometry,
  type MultiPolygon,
  type MultiPolygonCoordinate,
  type MultiPolygonFeature,
  type MultiPolygonGeoJSON,
  type MultiPolygonGeometry,
  type OsmLineProperties,
  type OsmLineStringProperties,
  type OsmPointLikeFeature /* for POI */,
  type OsmPointLikeGeoJSON /* for POI */,
  type OsmPointLikeProperties /* for POI */,
  type OsmPointProperties,
  type OsmPolygonProperties,
  type Point,
  type PointCoordinate,
  type PointFeature,
  type PointGeoJSON,
  type PointGeometry,
  type PolygonCoordinate,
  type PolygonFeature,
  type PolygonGeoJSON,
  type PolygonGeometry,
}

export { calcScale, lineToPath, multiLineStringToPath, multiPolygonToPath }

export { type POI }

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

export { findFeature, findProperties, getOsmId, getPropertyValue }

export { geolocActorStart, geolocRequest, useGeolocPosition }
