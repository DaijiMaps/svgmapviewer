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

export type MapData = {
  areas: MultiPolygonGeoJSON
  origin: PointGeoJSON
  measures: LineGeoJSON<MeasureProperties>
  viewbox: LineGeoJSON

  points: OsmPointGeoJSON
  lines: OsmLineGeoJSON
  multilinestrings: OsmMultiLineStringGeoJSON
  multipolygons: OsmMultiPolygonGeoJSON
  midpoints: OsmMidpointGeoJSON
  centroids: OsmCentroidGeoJSON
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
  midpoints: emptyGeoJSON as OsmMidpointGeoJSON,
  centroids: emptyGeoJSON as OsmCentroidGeoJSON,
}

////

export type PointMap = Map<number, OsmPointFeature>
export type LineMap = Map<number, OsmLineFeature>
export type MultiLineStringMap = Map<number, OsmMultiLineStringFeature>
export type MultiPolygonMap = Map<number, OsmMultiPolygonFeature>
export type MidpointMap = Map<number, OsmMidpointFeature>
export type CentroidMap = Map<number, OsmCentroidFeature>

export type MapMap = {
  pointMap: PointMap
  lineMap: LineMap
  multilinestringMap: MultiLineStringMap
  multipolygonMap: MultiPolygonMap
  midpointMap: MidpointMap
  centroidMap: CentroidMap
}

////

export type OsmPointLikeProperties =
  | OsmPointProperties
  | OsmLineProperties /* midpoints */
  | OsmPolygonProperties /* centroids */

export type OsmPointLikeFeature =
  | OsmPointFeature
  | OsmLineFeature
  | OsmMultiPolygonFeature

export interface OsmPointLikeGeoJSON {
  points: OsmPointGeoJSON
  midpoints: OsmMidpointGeoJSON
  centroids: OsmCentroidGeoJSON
}

export type MeasureProperties = {
  direction: string
  distance: number
  ellipsoidal_distance: number
}

export type MapCoord = {
  matrix: DOMMatrixReadOnly
}
