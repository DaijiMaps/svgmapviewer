import {
  emptyGeoJSON,
  type LineGeoJSON,
  type MultiPolygonGeoJSON,
  type PointGeoJSON,
} from './geojson-types'
import {
  type OsmLineFeature,
  type OsmLineGeoJSON,
  type OsmMultiLineStringFeature,
  type OsmMultiLineStringGeoJSON,
  type OsmMultiPolygonFeature,
  type OsmMultiPolygonGeoJSON,
  type OsmPointFeature,
  type OsmPointGeoJSON,
} from './osm-types'

export interface MapData {
  areas: MultiPolygonGeoJSON
  origin: PointGeoJSON
  measures: LineGeoJSON<MeasureProperties>
  viewbox: LineGeoJSON

  points: OsmPointGeoJSON
  lines: OsmLineGeoJSON
  multilinestrings: OsmMultiLineStringGeoJSON
  multipolygons: OsmMultiPolygonGeoJSON
}

export const emptyMapData: MapData = {
  areas: emptyGeoJSON as MultiPolygonGeoJSON,
  origin: emptyGeoJSON as PointGeoJSON,
  measures: emptyGeoJSON as LineGeoJSON<MeasureProperties>,
  viewbox: emptyGeoJSON as LineGeoJSON,

  points: emptyGeoJSON as OsmPointGeoJSON,
  lines: emptyGeoJSON as OsmLineGeoJSON,
  multilinestrings: emptyGeoJSON as OsmMultiLineStringGeoJSON,
  multipolygons: emptyGeoJSON as OsmMultiPolygonGeoJSON,
}

////

export type PointMap = Map<number, OsmPointFeature>
export type LineMap = Map<number, OsmLineFeature>
export type MultiLineStringMap = Map<number, OsmMultiLineStringFeature>
export type MultiPolygonMap = Map<number, OsmMultiPolygonFeature>

export interface MapMap {
  pointMap: PointMap
  lineMap: LineMap
  multilinestringMap: MultiLineStringMap
  multipolygonMap: MultiPolygonMap
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
