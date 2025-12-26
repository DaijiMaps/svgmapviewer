import {
  emptyGeoJSON,
  type LineStringGeoJSON,
  type MultiPolygonGeoJSON,
  type PointGeoJSON,
} from './geojson-types'
import {
  type OsmLineFeature,
  type OsmLineStringGeoJSON,
  type OsmMultiLineStringFeature,
  type OsmMultiLineStringGeoJSON,
  type OsmMultiPolygonFeature,
  type OsmMultiPolygonGeoJSON,
  type OsmPointFeature,
  type OsmPointGeoJSON,
} from './osm-types'

export interface OsmMapData {
  areas: MultiPolygonGeoJSON
  internals: MultiPolygonGeoJSON
  origin: PointGeoJSON
  measures: LineStringGeoJSON<MeasureProperties>
  viewbox: LineStringGeoJSON

  points: OsmPointGeoJSON
  lines: OsmLineStringGeoJSON
  multilinestrings: OsmMultiLineStringGeoJSON
  multipolygons: OsmMultiPolygonGeoJSON
}

export const emptyMapData: OsmMapData = {
  areas: emptyGeoJSON as MultiPolygonGeoJSON,
  internals: emptyGeoJSON as MultiPolygonGeoJSON,
  origin: emptyGeoJSON as PointGeoJSON,
  measures: emptyGeoJSON as LineStringGeoJSON<MeasureProperties>,
  viewbox: emptyGeoJSON as LineStringGeoJSON,

  points: emptyGeoJSON as OsmPointGeoJSON,
  lines: emptyGeoJSON as OsmLineStringGeoJSON,
  multilinestrings: emptyGeoJSON as OsmMultiLineStringGeoJSON,
  multipolygons: emptyGeoJSON as OsmMultiPolygonGeoJSON,
}

////

export type PointMap = ReadonlyMap<number, OsmPointFeature>
export type LineMap = ReadonlyMap<number, OsmLineFeature>
export type MultiLineStringMap = ReadonlyMap<number, OsmMultiLineStringFeature>
export type MultiPolygonMap = ReadonlyMap<number, OsmMultiPolygonFeature>

export interface OsmMapMap {
  pointMap: PointMap
  lineMap: LineMap
  multilinestringMap: MultiLineStringMap
  multipolygonMap: MultiPolygonMap
}

export const emptyMapMap: OsmMapMap = {
  pointMap: new Map(),
  lineMap: new Map(),
  multilinestringMap: new Map(),
  multipolygonMap: new Map(),
}

////

export interface MeasureProperties {
  direction: string
  distance: number
  ellipsoidal_distance: number
}

export interface MapCoord {
  matrix: DOMMatrixReadOnly
}

export const emptyMapCoord: MapCoord = {
  matrix: new DOMMatrixReadOnly(),
}
