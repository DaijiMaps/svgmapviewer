import {
  emptyGeoJSON,
  type LineGeoJSON,
  type MultiPolygonGeoJSON,
  type PointGeoJSON,
} from './geojson-types'
import {
  type OsmCentroidGeoJSON,
  type OsmLineFeature,
  type OsmLineGeoJSON,
  type OsmLineProperties,
  type OsmMidpointGeoJSON,
  type OsmMultilinestringGeoJSON,
  type OsmMultipolygonFeature,
  type OsmMultipolygonGeoJSON,
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
  multilinestrings: OsmMultilinestringGeoJSON
  multipolygons: OsmMultipolygonGeoJSON
  centroids: OsmCentroidGeoJSON
  midpoints: OsmMidpointGeoJSON
}

export const emptyMapData: MapData = {
  areas: emptyGeoJSON as MultiPolygonGeoJSON,
  origin: emptyGeoJSON as PointGeoJSON,
  measures: emptyGeoJSON as LineGeoJSON<MeasureProperties>,
  viewbox: emptyGeoJSON as LineGeoJSON,

  points: emptyGeoJSON as OsmPointGeoJSON,
  lines: emptyGeoJSON as OsmLineGeoJSON,
  multilinestrings: emptyGeoJSON as OsmMultilinestringGeoJSON,
  multipolygons: emptyGeoJSON as OsmMultipolygonGeoJSON,
  centroids: emptyGeoJSON as OsmCentroidGeoJSON,
  midpoints: emptyGeoJSON as OsmMidpointGeoJSON,
}

export type OsmPointLikeProperties =
  | OsmPointProperties
  | OsmLineProperties /* midpoints */
  | OsmPolygonProperties /* centroids */

export type OsmPointLikeFeature =
  | OsmPointFeature
  | OsmLineFeature
  | OsmMultipolygonFeature

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
