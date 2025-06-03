import {
  type MapCoord,
  type MapData,
  type MapMap,
  type MeasureProperties,
  type OsmPointLikeFeature,
  type OsmPointLikeGeoJSON,
  type OsmPointLikeProperties,
} from './data-types'
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
import { lineToPath, multiLineStringToPath, multiPolygonToPath } from './path'
import {
  type Line,
  type MultiLineString,
  type MultiPolygon,
  type Point,
} from './path-types'
import {
  type AllFilters,
  type CentroidsFilter,
  type LinesFilter,
  type MidpointsFilter,
  type MultiPolygonsFilter,
  type POI,
  type PointsFilter,
} from './poi-types'
import { geolocActorStart, getPosition, usePosition } from './position-xstate'
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
  type MapCoord,
  type MapData,
  type MapMap,
  type MeasureProperties,
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

export {
  type AllFilters,
  type CentroidsFilter,
  type LinesFilter,
  type MidpointsFilter,
  type MultiPolygonsFilter,
  type POI,
  type PointsFilter,
}

//// filter types

export { findFeature, findProperties, getOsmId, getPropertyValue }

export { geolocActorStart, getPosition, usePosition }
