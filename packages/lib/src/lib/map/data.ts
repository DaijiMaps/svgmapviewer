import {
  emptyGeoJSON,
  LineGeoJSON,
  MultiLineGeoJSON,
  MultiPolygonGeoJSON,
  PointGeoJSON,
} from './geojson-types'
import {
  OsmLineProperties,
  OsmLineStringProperties,
  OsmPointProperties,
  OsmPolygonProperties,
} from './osm-types'

export type MapData = {
  areas: MultiPolygonGeoJSON
  origin: PointGeoJSON
  measures: LineGeoJSON<{
    length: number
  }>
  viewbox: LineGeoJSON

  points: PointGeoJSON<OsmPointProperties>
  lines: LineGeoJSON<OsmLineProperties>
  multilinestrings: MultiLineGeoJSON<OsmLineStringProperties>
  multipolygons: MultiPolygonGeoJSON<OsmPolygonProperties>
  centroids: PointGeoJSON<OsmPolygonProperties>
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
