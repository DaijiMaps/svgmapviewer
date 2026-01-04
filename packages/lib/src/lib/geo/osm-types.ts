import { type ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'

import {
  type LineFeature,
  type LineStringGeoJSON,
  type MultiLineFeature,
  type MultiLineStringGeoJSON,
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
  ReadonlyRecord<OsmPointPropertiesKey, null | string> & {
    readonly centroid_x: null | number
    readonly centroid_y: null | number
    readonly area?: null
  }
>
export type OsmLineProperties = Readonly<
  ReadonlyRecord<OsmLinePropertiesKey, null | string> & {
    readonly centroid_x: null | number
    readonly centroid_y: null | number
    readonly area?: null
    readonly z_order: number
  }
>
export type OsmLineStringProperties = Readonly<
  ReadonlyRecord<OsmLineStringPropertiesKey, null | string> & {
    readonly centroid_x: null | number
    readonly centroid_y: null | number
    readonly area?: null
  }
>
export type OsmPolygonProperties = Readonly<
  ReadonlyRecord<OsmPolygonPropertiesKey, null | string> & {
    readonly centroid_x: null | number
    readonly centroid_y: null | number
    readonly area: null | number
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

export type OsmPointFeatures = readonly OsmPointFeature[]
export type OsmLineFeatures = readonly OsmLineFeature[]
export type OsmMultiLineStringFeatures = readonly OsmMultiLineStringFeature[]
export type OsmMultiPolygonFeatures = readonly OsmMultiPolygonFeature[]

export type OsmPointGeoJSON = Readonly<PointGeoJSON<OsmPointProperties>>
export type OsmLineStringGeoJSON = Readonly<
  LineStringGeoJSON<OsmLineProperties>
>
export type OsmMultiLineStringGeoJSON = Readonly<
  MultiLineStringGeoJSON<OsmLineStringProperties>
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
  | OsmLineStringGeoJSON
  | OsmMultiLineStringGeoJSON
  | OsmMultiPolygonGeoJSON
