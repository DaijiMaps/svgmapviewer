import {
  emptyGeoJSON,
  LineGeoJSON,
  MultiPolygonGeoJSON,
  PointGeoJSON,
} from './geojson-types'
import {
  OsmCentroidGeoJSON,
  OsmLineGeoJSON,
  OsmMultilinestringGeoJSON,
  OsmMultipolygonGeoJSON,
  OsmPointGeoJSON,
} from './osm-types'

export type MapData = {
  areas: MultiPolygonGeoJSON
  origin: PointGeoJSON
  measures: LineGeoJSON<{
    direction: string
    distance: number
    ellipsoidal_distance: number
  }>
  viewbox: LineGeoJSON

  points: OsmPointGeoJSON
  lines: OsmLineGeoJSON
  multilinestrings: OsmMultilinestringGeoJSON
  multipolygons: OsmMultipolygonGeoJSON
  centroids: OsmCentroidGeoJSON
}

export const emptyMapData: MapData = {
  areas: emptyGeoJSON,
  origin: emptyGeoJSON,
  measures: emptyGeoJSON,
  viewbox: emptyGeoJSON,

  points: emptyGeoJSON,
  lines: emptyGeoJSON,
  multilinestrings: emptyGeoJSON,
  multipolygons: emptyGeoJSON,
  centroids: emptyGeoJSON,
}
