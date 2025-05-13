import {
  LineGeoJSON,
  MultiLineGeoJSON,
  MultiPolygonGeoJSON,
  PointGeoJSON,
} from './geojson-types'

export type OsmPointPropertiesKey =
  | 'osm_id'
  | 'name'
  | 'barrier'
  | 'highway'
  | 'ref'
  | 'address'
  | 'is_in'
  | 'place'
  | 'man_made'
  | 'other_tags'

export type OsmLinePropertiesKey =
  | 'osm_id'
  | 'name'
  | 'highway'
  | 'waterway'
  | 'aerialway'
  | 'barrier'
  | 'man_made'
  //| 'z_order'
  | 'other_tags'
//| 'centroid_x' // XXX local extension
//| 'centroid_y' // XXX local extension

export type OsmLineStringPropertiesKey =
  | 'osm_id'
  | 'name'
  | 'type'
  | 'other_tags'

export type OsmPolygonPropertiesKey =
  | 'osm_id'
  | 'osm_way_id'
  | 'name'
  | 'type'
  | 'aeroway'
  | 'amenity'
  | 'admin_level'
  | 'barrier'
  | 'boundary'
  | 'building'
  | 'craft'
  | 'geological'
  | 'historic'
  | 'land_area'
  | 'landuse'
  | 'leisure'
  | 'man_made'
  | 'military'
  | 'natural'
  | 'office'
  | 'place'
  | 'shop'
  | 'sport'
  | 'tourism'
  | 'other_tags'
  | 'area' // XXX local extension
  | 'centroid_x' // XXX local extension
  | 'centroid_y' // XXX local extension

export type OsmPointProperties = Record<OsmPointPropertiesKey, null | string>
export type OsmLineProperties = Record<OsmLinePropertiesKey, null | string> & {
  z_order: number
}
export type OsmLineStringProperties = Record<
  OsmLineStringPropertiesKey,
  null | string
>
export type OsmPolygonProperties = Record<
  OsmPolygonPropertiesKey,
  null | string
>

export type OsmPointGeoJSON = PointGeoJSON<OsmPointProperties>
export type OsmLineGeoJSON = LineGeoJSON<OsmLineProperties>
export type OsmMultilinestringGeoJSON =
  MultiLineGeoJSON<OsmLineStringProperties>
export type OsmMultipolygonGeoJSON = MultiPolygonGeoJSON<OsmPolygonProperties>
export type OsmCentroidGeoJSON = PointGeoJSON<OsmPolygonProperties>
export type OsmMidpointGeoJSON = PointGeoJSON<OsmLineProperties>
