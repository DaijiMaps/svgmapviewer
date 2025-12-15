import type {
  LineFeature,
  MultiPolygonGeoJSON,
  PointFeature,
  PolygonFeature,
} from '../geo'
import { type Line, type MultiPolygon, type Point } from '../geo/path-types'
import {
  type LinesFilter,
  type MultiPolygonsFilter,
  type PointsFilter,
} from '../geo/poi-types'

//// layers

export type OsmMapLayer = MapLineLayer | MapMultiPolygonLayer

export interface MapLineLayer {
  readonly type: 'line'
  readonly name: string
  readonly width?: number
  readonly widthScale?: number
  readonly filter?: LinesFilter
  readonly data?: readonly Line[]
}

export interface MapMultiPolygonLayer {
  readonly type: 'multipolygon'
  readonly name: string
  readonly width?: number
  readonly widthScale?: number
  readonly filter?: MultiPolygonsFilter
  readonly data?: readonly MultiPolygon[]
}

export interface LinePath {
  readonly name?: string
  readonly id?: string
  readonly tags: readonly string[]
  readonly width?: number
  readonly widthScale?: number
  readonly vs: Line
}

export interface MultiPolygonPath {
  readonly name?: string
  readonly id?: string
  readonly tags: readonly string[]
  readonly width?: number
  readonly widthScale?: number
  readonly vs: MultiPolygon
}
//// markers

export interface RenderMapMarkersProps {
  readonly m: DOMMatrixReadOnly
  readonly mapMarkers: readonly OsmMapMarkers[]
  readonly fontSize: number
  readonly s: number
}

export interface MapMarker {
  readonly name: string
  readonly href: string
  readonly data?: Point
}

export interface OsmMapMarkers extends WithFilters {
  readonly name: string
}

//// objects

// XXX take size (width/height)
// XXX calc stroke-width (0.05% of width/height)
export interface OsmMapObjects extends WithFilters {
  readonly name: string
  readonly path: string
  readonly width: number
}

//// symbols

export interface RenderMapSymbolsProps {
  readonly m: DOMMatrixReadOnly
  readonly mapSymbols: readonly OsmMapSymbols[]
}

export interface OsmMapSymbols extends WithFilters {
  readonly name: string
  readonly href: string
}

//// common

export interface WithFilters {
  readonly pointsFilter?: PointsFilter
  readonly linesFilter?: LinesFilter
  readonly polygonsFilter?: MultiPolygonsFilter
  readonly data?: readonly Point[]
}

export interface WithFeatures<P = object> {
  readonly pointFeatures: readonly PointFeature<P>[]
  readonly lineFeatures: readonly LineFeature<P>[]
  readonly polygonFeatures: readonly PolygonFeature<P>[]
}

////

export interface CartoConfig {
  readonly backgroundColor?: string
  readonly mapSvgStyle?: string

  readonly internals?: MultiPolygonGeoJSON

  readonly skipNamePattern?: RegExp
  readonly splitNamePattern?: RegExp

  readonly filterLabelsByRange?: boolean
}
