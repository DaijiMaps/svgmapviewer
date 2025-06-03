import { mapMapFromMapData } from './data'
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
  type OsmFeature,
  type OsmGeoJSON,
  type OsmLineProperties,
  type OsmLineStringProperties,
  type OsmPointProperties,
  type OsmPolygonProperties,
  type OsmProperties,
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
  type LinesFilter,
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

export { mapMapFromMapData }

export {
  type MapCoord,
  type MapData,
  type MapMap,
  type MeasureProperties,
  type OsmPointLikeFeature,
  type OsmPointLikeGeoJSON,
  type OsmPointLikeProperties,
}

export { calcScale }

export {
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
}

export {
  type OsmFeature,
  type OsmGeoJSON,
  type OsmLineProperties,
  type OsmLineStringProperties,
  type OsmPointProperties,
  type OsmPolygonProperties,
  type OsmProperties,
}

export { lineToPath, multiLineStringToPath, multiPolygonToPath }

export { type Line, type MultiLineString, type MultiPolygon, type Point }

export {
  type AllFilters,
  type LinesFilter,
  type MultiPolygonsFilter,
  type POI,
  type PointsFilter,
}

export { geolocActorStart, getPosition, usePosition }

export { findFeature, findProperties, getOsmId, getPropertyValue }
