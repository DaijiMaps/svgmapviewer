import {
  emptyGeoJSON,
  type LineGeoJSON,
  type MultiPolygonGeoJSON,
  type PointGeoJSON,
} from './geojson-types'
import {
  type OsmCentroidFeature,
  type OsmCentroidGeoJSON,
  type OsmLineFeature,
  type OsmLineGeoJSON,
  type OsmLineProperties,
  type OsmMidpointFeature,
  type OsmMidpointGeoJSON,
  type OsmMultiLineStringFeature,
  type OsmMultiLineStringGeoJSON,
  type OsmMultiPolygonFeature,
  type OsmMultiPolygonGeoJSON,
  type OsmPointFeature,
  type OsmPointGeoJSON,
  type OsmPointProperties,
  type OsmPolygonProperties,
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
  midpoints: OsmMidpointGeoJSON // XXX
  centroids: OsmCentroidGeoJSON // XXX
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
  midpoints: emptyGeoJSON as OsmMidpointGeoJSON, // XXX
  centroids: emptyGeoJSON as OsmCentroidGeoJSON, // XXX
}

////

export type PointMap = Map<number, OsmPointFeature>
export type LineMap = Map<number, OsmLineFeature>
export type MultiLineStringMap = Map<number, OsmMultiLineStringFeature>
export type MultiPolygonMap = Map<number, OsmMultiPolygonFeature>
export type MidpointMap = Map<number, OsmMidpointFeature> // XXX
export type CentroidMap = Map<number, OsmCentroidFeature> // XXX

export interface MapMap {
  pointMap: PointMap
  lineMap: LineMap
  multilinestringMap: MultiLineStringMap
  multipolygonMap: MultiPolygonMap
  midpointMap: MidpointMap // XXX
  centroidMap: CentroidMap // XXX
}

////

// XXX
export type OsmPointLikeProperties =
  | OsmPointProperties
  | OsmLineProperties /* midpoints */ // XXX
  | OsmPolygonProperties /* centroids */ // XXX

// XXX
export type OsmPointLikeFeature =
  | OsmPointFeature
  | OsmMidpointFeature // XXX
  | OsmCentroidFeature // XXX

// XXX
export interface OsmPointLikeGeoJSON {
  points: OsmPointGeoJSON
  midpoints: OsmMidpointGeoJSON
  centroids: OsmCentroidGeoJSON
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
