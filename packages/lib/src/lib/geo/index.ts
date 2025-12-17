import { getAddressEntries } from './address-data'
import { mapMapFromMapData } from './data'
import {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
  type MeasureProperties,
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
  type OsmLineGeoJSON,
  type OsmLineProperties,
  type OsmLineStringProperties,
  type OsmMultiLineStringGeoJSON,
  type OsmMultiPolygonGeoJSON,
  type OsmPointGeoJSON,
  type OsmPointProperties,
  type OsmPolygonProperties,
  type OsmProperties,
} from './osm-types'
import {
  lineToPathD,
  multiLineStringToPathD,
  multiPolygonToPathD,
} from './path'
import {
  type Line,
  type MultiLineString,
  type MultiPolygon,
  type Point,
} from './path-types'
import {
  type LinesFilter,
  type MultiPolygonsFilter,
  type PointsFilter,
} from './poi-types'
import { geolocActorStart, getPosition, usePosition } from './position-xstate'
import {
  findFeature,
  findProperties,
  getAddressInfo,
  getOsmId,
  getPropertyValue,
} from './search'
import { type OsmSearchEntry } from './search-types'

export { getAddressEntries, getAddressInfo }

export { mapMapFromMapData }

export {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
  type MeasureProperties,
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
  type OsmLineGeoJSON,
  type OsmLineProperties,
  type OsmLineStringProperties,
  type OsmMultiLineStringGeoJSON,
  type OsmMultiPolygonGeoJSON,
  type OsmPointGeoJSON,
  type OsmPointProperties,
  type OsmPolygonProperties,
  type OsmProperties,
}

export { lineToPathD, multiLineStringToPathD, multiPolygonToPathD }

export { type Line, type MultiLineString, type MultiPolygon, type Point }

export { type LinesFilter, type MultiPolygonsFilter, type PointsFilter }

export { geolocActorStart, getPosition, usePosition }

export { findFeature, findProperties, getOsmId, getPropertyValue }

export { type OsmSearchEntry }
