import { Schema } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'

const PropertiesSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Union(Schema.Null, Schema.Number, Schema.String),
})

const CrsSchema = Schema.Struct({
  type: Schema.String,
  properties: PropertiesSchema,
})

const PointCoordinateSchema = Schema.Tuple(Schema.Number, Schema.Number)
const LineCoordinateSchema = Schema.Array(PointCoordinateSchema)
const PolygonCoordinateSchema = Schema.Array(LineCoordinateSchema)
const MultiPolygonCoordinateSchema = Schema.Array(PolygonCoordinateSchema)

const PointCoordinatesSchema = Schema.Array(PointCoordinateSchema)
const LineCoordinatesSchema = Schema.Array(LineCoordinateSchema)
const PolygonCoordinatesSchema = Schema.Array(PolygonCoordinateSchema)
const MultiPolygonCoordinatesSchema = Schema.Array(MultiPolygonCoordinateSchema)

const CoordinatesSchema = Schema.Union(
  PointCoordinatesSchema,
  LineCoordinatesSchema,
  PolygonCoordinatesSchema,
  MultiPolygonCoordinatesSchema
)

const GeometrySchema = Schema.Struct({
  type: Schema.String,
  coordinates: CoordinatesSchema,
})
type GeometrySchema = Schema.Schema.Type<typeof GeometrySchema>

const FeatureSchema = Schema.Struct({
  type: Schema.String,
  properties: PropertiesSchema,
  geometry: GeometrySchema,
})
type FeatureSchema = Schema.Schema.Type<typeof FeatureSchema>

const FeaturesSchema = Schema.Array(FeatureSchema)
type FeaturesSchema = Schema.Schema.Type<typeof FeaturesSchema>

const GeoJSONSchema = Schema.Struct({
  type: Schema.String,
  name: Schema.String,
  crs: CrsSchema,
  features: FeaturesSchema,
})

////

export const decodeProperties: (
  u: unknown,
  overrideOptions?: ParseOptions
) => {
  readonly [x: string]: null | number | string
} = Schema.decodeUnknownSync(PropertiesSchema)

export const decodeGeoJSON: (
  u: unknown,
  overrideOptions?: ParseOptions
) => {
  readonly type: string
  readonly name: string
  readonly crs: {
    readonly type: string
    readonly properties: {
      readonly [x: string]: string | number | null
    }
  }
  readonly features: readonly {
    readonly type: string
    readonly properties: {
      readonly [x: string]: string | number | null
    }
    readonly geometry: {
      readonly type: string
      readonly coordinates:
        | readonly (readonly [number, number])[]
        | readonly (readonly (readonly [number, number])[])[]
        | readonly (readonly (readonly (readonly [number, number])[])[])[]
        | readonly (readonly (readonly (readonly (readonly [
            number,
            number,
          ])[])[])[])[]
    }
  }[]
} = Schema.decodeUnknownSync(GeoJSONSchema)
