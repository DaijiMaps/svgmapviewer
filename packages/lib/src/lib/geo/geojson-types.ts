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

export type PointCoordinate = [x: number, y: number]
export type LineCoordinate = PointCoordinate[]
export type PolygonCoordinate = LineCoordinate[]
export type MultiPointCoordinate = PointCoordinate[]
export type MultiLineCoordinate = LineCoordinate[]
export type MultiPolygonCoordinate = PolygonCoordinate[]

//// geometry

export interface CommontGeometry<C = unknown[]> {
  type: string
  coordinates: C
}

export type PointGeometry = CommontGeometry<PointCoordinate>
export type LineGeometry = CommontGeometry<LineCoordinate>
export type PolygonGeometry = CommontGeometry<PolygonCoordinate>
export type MultiPointGeometry = CommontGeometry<MultiPointCoordinate>
export type MultiLineGeometry = CommontGeometry<MultiLineCoordinate>
export type MultiPolygonGeometry = CommontGeometry<MultiPolygonCoordinate>

/*
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
*/

//// feature

export interface CommonFeature<P = object, G = object> {
  type: string
  properties: P
  geometry: G
}

export type PointFeature<P = object> = CommonFeature<P, PointGeometry>
export type LineFeature<P = object> = CommonFeature<P, LineGeometry>
export type PolygonFeature<P = object> = CommonFeature<P, PolygonGeometry>
export type MultiPointFeature<P = object> = CommonFeature<P, MultiPointGeometry>
export type MultiLineFeature<P = object> = CommonFeature<P, MultiLineGeometry>
export type MultiPolygonFeature<P = object> = CommonFeature<
  P,
  MultiPolygonGeometry
>

/*
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
*/

//// geojson

export interface BaseGeoJSON {
  type: string
  name?: string
  crs?: CRS
}

export interface CommonGeoJSON<P = object, G = object> extends BaseGeoJSON {
  features: CommonFeature<P, G>[]
}

export type PointGeoJSON<P = object> = CommonGeoJSON<P, PointGeometry>
export type LineGeoJSON<P = object> = CommonGeoJSON<P, LineGeometry>
export type PolygonGeoJSON<P = object> = CommonGeoJSON<P, PolygonGeometry>
export type MultiPointGeoJSON<P = object> = CommonGeoJSON<P, MultiPointGeometry>
export type MultiLineGeoJSON<P = object> = CommonGeoJSON<P, MultiLineGeometry>
export type MultiPolygonGeoJSON<P = object> = CommonGeoJSON<
  P,
  MultiPolygonGeometry
>

/*
export interface PointGeoJSON<P = object> extends BaseGeoJSON {
  features: PointFeature<P>[]
}

export interface LineGeoJSON<P = object> extends BaseGeoJSON {
  features: LineFeature<P>[]
}

export interface PolygonGeoJSON<P = object> extends BaseGeoJSON {
  features: PolygonFeature<P>[]
}

export interface MultiPointGeoJSON<P = object> extends BaseGeoJSON {
  features: MultiPointFeature<P>[]
}

export interface MultiLineGeoJSON<P = object> extends BaseGeoJSON {
  features: MultiLineFeature<P>[]
}

export interface MultiPolygonGeoJSON<P = object> extends BaseGeoJSON {
  features: MultiPolygonFeature<P>[]
}
*/

export const emptyGeoJSON: CommonGeoJSON = {
  type: '',
  name: '',
  crs: emptyCRS,
  features: [],
}
