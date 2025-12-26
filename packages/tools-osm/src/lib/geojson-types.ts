export type _Value = null | number | string

export type _Properties = {
  readonly [x: string]: _Value
}

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

export type _PointGeometry = {
  readonly type: 'Point'
  readonly coordinates: _PointCoordinates
}
export type _MultiPointGeometry = {
  readonly type: 'MultiPoint'
  readonly coordinates: _MultiPointCoordinates
}

export type _LineStringGeometry = {
  readonly type: 'LineString'
  readonly coordinates: _LineCoordinates
}
export type _MultiLineStringGeometry = {
  readonly type: 'MultiLineString'
  readonly coordinates: _MultiLineCoordinates
}

export type _PolygonGeometry = {
  readonly type: 'Polygon'
  readonly coordinates: _PolygonCoordinates
}
export type _MultiPolygonGeometry = {
  readonly type: 'MultiPolygon'
  readonly coordinates: _MultiPolygonCoordinates
}

export type _Geometry =
  | _PointGeometry
  | _MultiPointGeometry
  | _LineStringGeometry
  | _MultiLineStringGeometry
  | _PolygonGeometry
  | _MultiPolygonGeometry

export type _FeatureBase<G = _Geometry> = {
  readonly type: 'Feature'
  readonly properties: _Properties
  readonly geometry: G
}

export type _PointFeature = _FeatureBase<_PointGeometry>
export type _MultiPointFeature = _FeatureBase<_MultiPointGeometry>
export type _LineStringFeature = _FeatureBase<_LineStringGeometry>
export type _MultiLineStringFeature = _FeatureBase<_MultiLineStringGeometry>
export type _PolygonFeature = _FeatureBase<_PolygonGeometry>
export type _MultiPolygonFeature = _FeatureBase<_MultiPolygonGeometry>

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

export type _CrsName = {
  readonly type: 'name'
  readonly properties: _Properties
}

export type _CrsLink = {
  readonly type: 'link'
  readonly properties: _Properties
}

export type _Crs = _CrsName | _CrsLink

export type _GeoJSON = {
  readonly type: string
  readonly name: string
  readonly crs?: _Crs
  readonly features: _Features
}
