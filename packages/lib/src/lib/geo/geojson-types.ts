// XXX can't use tuple to read (import) JSON as external

export interface CRS {
  readonly type: string
  readonly properties: {
    readonly name: string
  }
}

export const emptyCRS: CRS = {
  type: '',
  properties: {
    name: '',
  },
}

//// coordinate

export type PointCoordinate = readonly [x: number, y: number]
export type LineCoordinate = readonly PointCoordinate[]
export type PolygonCoordinate = readonly LineCoordinate[]
export type MultiPointCoordinate = readonly PointCoordinate[]
export type MultiLineCoordinate = readonly LineCoordinate[]
export type MultiPolygonCoordinate = readonly PolygonCoordinate[]

//// geometry

export interface CommontGeometry<C = readonly unknown[]> {
  readonly type: string
  readonly coordinates: Readonly<C>
}

export type PointGeometry = CommontGeometry<PointCoordinate>
export type LineGeometry = CommontGeometry<LineCoordinate>
export type PolygonGeometry = CommontGeometry<PolygonCoordinate>
export type MultiPointGeometry = CommontGeometry<MultiPointCoordinate>
export type MultiLineGeometry = CommontGeometry<MultiLineCoordinate>
export type MultiPolygonGeometry = CommontGeometry<MultiPolygonCoordinate>

//// feature

export interface CommonFeature<P = object, G = object> {
  readonly type: string
  readonly properties: Readonly<P>
  readonly geometry: Readonly<G>
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
  readonly type: string
  readonly name?: string
  readonly crs?: CRS
  readonly features: readonly Readonly<CommonFeature<P, G>>[]
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
