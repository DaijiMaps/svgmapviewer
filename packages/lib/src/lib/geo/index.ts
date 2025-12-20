import { osmGetSearchEntries } from './address-data'
import { mapMapFromMapData } from './data'
import {
  type MapCoord,
  type MeasureProperties,
  type OsmMapData,
  type OsmMapMap,
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
import { geolocActorStart, usePosition } from './position-xstate'
import {
  findFeature,
  findProperties,
  getOsmId,
  getPropertyValue,
  osmGetSearchInfo,
} from './search'
import { type OsmSearchEntry } from './search-types'

// address-data
export { osmGetSearchEntries }

// data
export { mapMapFromMapData }

// data-types
export {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
  type MeasureProperties,
}

// geojson
export { calcScale }

// geojson-types
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

// osm-types
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

// path
export { lineToPathD, multiLineStringToPathD, multiPolygonToPathD }

// path-types
export { type Line, type MultiLineString, type MultiPolygon, type Point }

// poi-types
export { type LinesFilter, type MultiPolygonsFilter, type PointsFilter }

// position-xstate
export { geolocActorStart, usePosition }

// search
export {
  findFeature,
  findProperties,
  getOsmId,
  getPropertyValue,
  osmGetSearchInfo,
}

// search-types
export { type OsmSearchEntry }
