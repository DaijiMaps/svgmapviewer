import { Schema } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import type { _Crs, _Features, _Properties } from './geojson-types'

const PropertiesSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Union(Schema.Null, Schema.Number, Schema.String),
})

const PointType = Schema.Literal('Point')
const MultiPointType = Schema.Literal('MultiPoint')
const LineStringType = Schema.Literal('LineString')
const MultiLineStringType = Schema.Literal('MultiLineString')
const PolygonType = Schema.Literal('Polygon')
const MultiPolygonType = Schema.Literal('MultiPolygon')
// XXX const GeometryCollectionType = Schema.Literal('GeometryCollection')
const FeatureType = Schema.Literal('Feature')
const FeatureCollectionType = Schema.Literal('FeatureCollection')

const PointCoordinate = Schema.Tuple(Schema.Number, Schema.Number)
const MultiPointCoordinate = Schema.Array(PointCoordinate)
const LineStringCoordinate = Schema.Array(PointCoordinate)
const MultiLineStringCoordinate = Schema.Array(LineStringCoordinate)
const PolygonCoordinate = Schema.Array(LineStringCoordinate)
const MultiPolygonCoordinate = Schema.Array(PolygonCoordinate)

////

const PointGeometry = Schema.Struct({
  type: PointType,
  coordinates: PointCoordinate,
})
const MultiPointGeometry = Schema.Struct({
  type: MultiPointType,
  coordinates: MultiPointCoordinate,
})
const LineStringGeometry = Schema.Struct({
  type: LineStringType,
  coordinates: LineStringCoordinate,
})
const MultiLineStringGeometry = Schema.Struct({
  type: MultiLineStringType,
  coordinates: MultiLineStringCoordinate,
})
const PolygonGeometry = Schema.Struct({
  type: PolygonType,
  coordinates: PolygonCoordinate,
})
const MultiPolygonGeometry = Schema.Struct({
  type: MultiPolygonType,
  coordinates: MultiPolygonCoordinate,
})

////

const PointFeature = Schema.Struct({
  type: FeatureType,
  properties: PropertiesSchema,
  geometry: PointGeometry,
})
const MultiPointFeature = Schema.Struct({
  type: FeatureType,
  properties: PropertiesSchema,
  geometry: MultiPointGeometry,
})
const LineStringFeature = Schema.Struct({
  type: FeatureType,
  properties: PropertiesSchema,
  geometry: LineStringGeometry,
})
const MultiLineStringFeature = Schema.Struct({
  type: FeatureType,
  properties: PropertiesSchema,
  geometry: MultiLineStringGeometry,
})
const PolygonFeature = Schema.Struct({
  type: FeatureType,
  properties: PropertiesSchema,
  geometry: PolygonGeometry,
})
const MultiPolygonFeature = Schema.Struct({
  type: FeatureType,
  properties: PropertiesSchema,
  geometry: MultiPolygonGeometry,
})

const FeatureSchema = Schema.Union(
  PointFeature,
  MultiPointFeature,
  LineStringFeature,
  MultiLineStringFeature,
  PolygonFeature,
  MultiPolygonFeature
)
const FeatureCollectionSchema = Schema.Struct({
  type: FeatureCollectionType,
  features: Schema.Array(FeatureSchema),
})

const Features = Schema.Array(
  Schema.Union(FeatureSchema, FeatureCollectionSchema)
)

////

const CrsNameType = Schema.Literal('name')
const CrsLinkType = Schema.Literal('link')

const CrsName = Schema.Struct({
  type: CrsNameType,
  properties: Schema.Struct({
    name: Schema.String,
  }),
})
const CrsLink = Schema.Struct({
  type: CrsLinkType,
  properties: Schema.Struct({
    href: Schema.String,
    type: Schema.String,
  }),
})

const CrsSchema = Schema.Union(CrsName, CrsLink)

////

const GeoJSONSchema = Schema.Struct({
  type: Schema.String,
  name: Schema.String,
  crs: Schema.Union(Schema.Undefined, CrsSchema),
  features: Features,
})

////

export const decodeProperties: (
  u: unknown,
  overrideOptions?: ParseOptions
) => _Properties = Schema.decodeUnknownSync(PropertiesSchema)

export const decodeGeoJSON: (
  u: unknown,
  overrideOptions?: ParseOptions
) => {
  readonly type: string
  readonly features: _Features
  readonly name: string
  readonly crs: undefined | _Crs
} = Schema.decodeUnknownSync(GeoJSONSchema)
