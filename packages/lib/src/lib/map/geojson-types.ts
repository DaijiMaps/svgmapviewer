// XXX can't use tuple to read (import) JSON as external

export interface CRS {
  type: string
  properties: {
    name: string
  }
}

export const emptyCRS: CRS = {
  type: '',
  properties: {
    name: '',
  },
}

//// coordinate

export type PointCoordinate = number[]
export type LineCoordinate = PointCoordinate[]
export type PolygonCoordinate = LineCoordinate[]
export type MultiPointCoordinate = PointCoordinate[]
export type MultiLineCoordinate = LineCoordinate[]
export type MultiPolygonCoordinate = PolygonCoordinate[]

//// geometry

export interface PointGeometry {
  type: string // 'point' | 'Point'
  coordinates: PointCoordinate
}

export interface LineGeometry {
  type: string // 'linestring' | 'LineString'
  coordinates: LineCoordinate
}

export interface PolygonGeometry {
  type: string // 'polygon' | 'Polygon'
  coordinates: PolygonCoordinate
}

export interface MultiPointGeometry {
  type: string // 'multipoint' | 'MultiPoint'
  coordinates: MultiPointCoordinate
}

export interface MultiLineGeometry {
  type: string // 'multilinestring' | 'MultiLineString'
  coordinates: MultiLineCoordinate
}

export interface MultiPolygonGeometry {
  type: string // 'multipolygon' | 'MultiPolygon'
  coordinates: MultiPolygonCoordinate
}

//// feature

export interface PointFeature<P = object> {
  type: string
  properties: P
  geometry: PointGeometry
}

export interface LineFeature<P = object> {
  type: string
  properties: P
  geometry: LineGeometry
}

export interface PolygonFeature<P = object> {
  type: string
  properties: P
  geometry: PolygonGeometry
}

export interface MultiPointFeature<P = object> {
  type: string
  properties: P
  geometry: MultiPointGeometry
}

export interface MultiLineFeature<P = object> {
  type: string
  properties: P
  geometry: MultiLineGeometry
}

export interface MultiPolygonFeature<P = object> {
  type: string
  properties: P
  geometry: MultiPolygonGeometry
}

//// geojson

export interface PointGeoJSON<P = object> {
  type: string
  name: string
  crs: CRS
  features: PointFeature<P>[]
}

export interface LineGeoJSON<P = object> {
  type: string
  name: string
  crs: CRS
  features: LineFeature<P>[]
}

export interface PolygonGeoJSON<P = object> {
  type: string
  name: string
  crs: CRS
  features: PolygonFeature<P>[]
}

export interface MultiPointGeoJSON<P = object> {
  type: string
  name: string
  crs: CRS
  features: MultiPointFeature<P>[]
}

export interface MultiLineGeoJSON<P = object> {
  type: string
  name: string
  crs: CRS
  features: MultiLineFeature<P>[]
}

export interface MultiPolygonGeoJSON<P = object> {
  type: string
  name: string
  crs: CRS
  features: MultiPolygonFeature<P>[]
}

export const emptyGeoJSON = {
  type: '',
  name: '',
  crs: emptyCRS,
  features: [],
}
