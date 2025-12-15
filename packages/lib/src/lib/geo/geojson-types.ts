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

//// geojson

export interface CommonGeoJSON<P = object, G = object> {
  type: string
  name?: string
  crs?: CRS
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

export const emptyGeoJSON: CommonGeoJSON = {
  type: '',
  name: '',
  crs: emptyCRS,
  features: [],
}
