import {
  LineGeoJSON,
  MultiLineGeoJSON,
  MultiPolygonGeoJSON,
  PointGeoJSON,
} from './geojson-types'

export interface OsmPointProperties {
  osm_id: null | string
  name: null | string
  barrier: null | string
  highway: null | string
  ref: null | string
  address: null | string
  is_in: null | string
  place: null | string
  man_made: null | string
  other_tags: null | string
}

export interface OsmLineProperties {
  osm_id: null | string
  name: null | string
  highway: null | string
  waterway: null | string
  aerialway: null | string
  barrier: null | string
  man_made: null | string
  z_order: null | number
  other_tags: null | string
}

export interface OsmLineStringProperties {
  osm_id: null | string
  name: null | string
  type: null | string
  other_tags: null | string
}

export interface OsmPolygonProperties {
  osm_id: null | string
  osm_way_id: null | string
  name: null | string
  type: null | string
  aeroway: null | string
  amenity: null | string
  admin_level: null | string
  barrier: null | string
  boundary: null | string
  building: null | string
  craft: null | string
  geological: null | string
  historic: null | string
  land_area: null | string
  landuse: null | string
  leisure: null | string
  man_made: null | string
  military: null | string
  natural: null | string
  office: null | string
  place: null | string
  shop: null | string
  sport: null | string
  tourism: null | string
  other_tags: null | string
}

export type OsmPointGeoJSON = PointGeoJSON<OsmPointProperties>
export type OsmLineGeoJSON = LineGeoJSON<OsmLineProperties>
export type OsmMultilinestringGeoJSON =
  MultiLineGeoJSON<OsmLineStringProperties>
export type OsmMultipolygonGeoJSON = MultiPolygonGeoJSON<OsmPolygonProperties>
export type OsmCentroidGeoJSON = PointGeoJSON<OsmPolygonProperties>
