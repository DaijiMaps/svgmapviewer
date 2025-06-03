import {
  type LineFeature,
  type LineGeoJSON,
  type MultiLineFeature,
  type MultiLineGeoJSON,
  type MultiPolygonFeature,
  type MultiPolygonGeoJSON,
  type PointFeature,
  type PointGeoJSON,
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
  | 'other_tags'

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

export type OsmPointProperties = Readonly<
  Record<OsmPointPropertiesKey, null | string> & {
    centroid_x: null | number
    centroid_y: null | number
  }
>
export type OsmLineProperties = Readonly<
  Record<OsmLinePropertiesKey, null | string> & {
    centroid_x: null | number
    centroid_y: null | number
    z_order: number
  }
>
export type OsmLineStringProperties = Readonly<
  Record<OsmLineStringPropertiesKey, null | string> & {
    centroid_x: null | number
    centroid_y: null | number
  }
>
export type OsmPolygonProperties = Readonly<
  Record<OsmPolygonPropertiesKey, null | string> & {
    centroid_x: null | number
    centroid_y: null | number
    area: null | number
  }
>

export type OsmPointFeature = Readonly<PointFeature<OsmPointProperties>>
export type OsmLineFeature = Readonly<LineFeature<OsmLineProperties>>
export type OsmMultiLineStringFeature = Readonly<
  MultiLineFeature<OsmLineStringProperties>
>
export type OsmMultiPolygonFeature = Readonly<
  MultiPolygonFeature<OsmPolygonProperties>
>
export type OsmPointGeoJSON = Readonly<PointGeoJSON<OsmPointProperties>>
export type OsmLineGeoJSON = Readonly<LineGeoJSON<OsmLineProperties>>
export type OsmMultiLineStringGeoJSON = Readonly<
  MultiLineGeoJSON<OsmLineStringProperties>
>
export type OsmMultiPolygonGeoJSON = Readonly<
  MultiPolygonGeoJSON<OsmPolygonProperties>
>
export type OsmProperties =
  | OsmPointProperties
  | OsmLineProperties
  | OsmLineStringProperties // XXX
  | OsmPolygonProperties

export type OsmFeature =
  | OsmPointFeature
  | OsmLineFeature
  | OsmMultiLineStringFeature
  | OsmMultiPolygonFeature

export type OsmGeoJSON =
  | OsmPointGeoJSON
  | OsmLineGeoJSON
  | OsmMultiLineStringGeoJSON
  | OsmMultiPolygonGeoJSON
