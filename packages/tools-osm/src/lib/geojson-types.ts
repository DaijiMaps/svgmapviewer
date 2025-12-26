//// value

export type _Value = null | number | string

//// properties

export type _Properties = {
  readonly [x: string]: _Value
}

//// coordinates

export type _PointCoordinates = readonly [number, number]
export type _MultiPointCoordinates = readonly _PointCoordinates[]
export type _LineCoordinates = _MultiPointCoordinates
export type _MultiLineCoordinates = readonly _LineCoordinates[]
export type _PolygonCoordinates = _MultiLineCoordinates
export type _MultiPolygonCoordinates = readonly _PolygonCoordinates[]

export type _Coordinates =
  | _PointCoordinates
  | _MultiPointCoordinates
  //| _LineCoordinates
  | _MultiLineCoordinates
  //| _PolygonCoordinates
  | _MultiPolygonCoordinates

//// geometry

type __Geometry<t, c> = {
  readonly type: t
  readonly coordinates: c
}

export type _PointGeometry = __Geometry<'Point', _PointCoordinates>
export type _MultiPointGeometry = __Geometry<
  'MultiPoint',
  _MultiPointCoordinates
>
export type _LineStringGeometry = __Geometry<'LineString', _LineCoordinates>
export type _MultiLineStringGeometry = __Geometry<
  'MultiLineString',
  _MultiLineCoordinates
>
export type _PolygonGeometry = __Geometry<'Polygon', _PolygonCoordinates>
export type _MultiPolygonGeometry = __Geometry<
  'MultiPolygon',
  _MultiPolygonCoordinates
>

export type _Geometry =
  | _PointGeometry
  | _MultiPointGeometry
  | _LineStringGeometry
  | _MultiLineStringGeometry
  | _PolygonGeometry
  | _MultiPolygonGeometry

//// features

export type __Feature<G = _Geometry> = {
  readonly type: 'Feature'
  readonly properties: _Properties
  readonly geometry: G
}

export type _PointFeature = __Feature<_PointGeometry>
export type _MultiPointFeature = __Feature<_MultiPointGeometry>
export type _LineStringFeature = __Feature<_LineStringGeometry>
export type _MultiLineStringFeature = __Feature<_MultiLineStringGeometry>
export type _PolygonFeature = __Feature<_PolygonGeometry>
export type _MultiPolygonFeature = __Feature<_MultiPolygonGeometry>

export type _Feature =
  | _PointFeature
  | _MultiPointFeature
  | _LineStringFeature
  | _MultiLineStringFeature
  | _PolygonFeature
  | _MultiPolygonFeature

export type _FeatureCollection = {
  readonly type: 'FeatureCollection'
  readonly features: readonly _Feature[]
}

export type _GeometryCollection = {
  readonly type: 'GeometryCollection'
  readonly geometries: readonly _Geometry[]
}

export type _Features = readonly (_Feature | _FeatureCollection)[]

//// crs

export type _CrsName = {
  readonly type: 'name'
  readonly properties: _Properties
}

export type _CrsLink = {
  readonly type: 'link'
  readonly properties: _Properties
}

export type _Crs = _CrsName | _CrsLink

//// GeoJSON

export type _GeoJSON = {
  readonly type: string
  readonly name: string
  readonly crs?: _Crs
  readonly features: _Features
}
